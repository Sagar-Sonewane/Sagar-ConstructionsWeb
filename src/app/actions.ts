"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { headers } from "next/headers";
import {
  contactSchema,
  appointmentSchema,
  consultationSchema,
  quotationSchema,
  sellPropertySchema,
  buyPropertySchema,
  fileValidation,
} from "@/lib/validation/schemas";

// In-Memory Rate Limiting Cache (IP -> submission timestamps)
const ipCache = new Map<string, number[]>();

function checkRateLimit(ip: string, limit = 3, timeframe = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];
  
  // Filter out timestamps older than the timeframe (e.g. 1 minute)
  const activeTimestamps = timestamps.filter((t) => now - t < timeframe);
  
  if (activeTimestamps.length >= limit) {
    return false;
  }
  
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return true;
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

// Helper to send email notification
async function sendNotificationEmail({
  type,
  name,
  phone,
  email,
  details,
}: {
  type: string;
  name: string;
  phone: string;
  email?: string;
  details: Record<string, any>;
}) {
  const toEmail = process.env.NOTIFICATION_EMAIL_TO || "sagar.constructions.inbox@gmail.com";
  const fromEmail = process.env.NOTIFICATION_EMAIL_FROM || "onboarding@resend.dev";
  const apiKey = process.env.RESEND_API_KEY;

  const formattedDetails = Object.entries(details)
    .map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`)
    .join("");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #fcfbfa;">
      <h2 style="color: #1c3d3a; border-bottom: 2px solid #5a7d75; padding-bottom: 10px; font-family: 'Times New Roman', serif;">
        Sagar Constructions - New Lead Notification
      </h2>
      <p style="font-size: 14px; color: #4a4a4a;">You have received a new <strong>${type}</strong> submission.</p>
      <div style="background-color: #f3f0ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 1.6; color: #2c2c2c;">
          <li><strong>Customer Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phone}</li>
          <li><strong>Email Address:</strong> ${email || "Not Provided"}</li>
          ${formattedDetails}
          <li><strong>Submission Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</li>
        </ul>
      </div>
      <p style="font-size: 11px; color: #888888; text-align: center; margin-top: 20px;">
        This is an automated notification from the Sagar Constructions lead processing system.
      </p>
    </div>
  `;

  if (!apiKey || apiKey === "re_123456789") {
    console.log("\n================ [EMAIL NOTIFICATION MOCK] ================");
    console.log(`To: ${toEmail}`);
    console.log(`From: ${fromEmail}`);
    console.log(`Subject: New ${type} from ${name}`);
    console.log("Details:", details);
    console.log("============================================================\n");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Sagar Constructions] New ${type} from ${name}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API returned an error:", error);
    } else {
      console.log(`Resend email dispatched successfully! ID: ${data?.id}`);
    }
  } catch (err) {
    console.error("Failed to send email via Resend (network or client issue):", err);
  }
}

// 1. Submit Contact Form Action
export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      serviceInterested: formData.get("serviceInterested"),
      message: formData.get("message"),
    };

    const validated = contactSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { fullName, phone, email, serviceInterested, message } = validated.data;
    const db = getSupabaseAdmin();
    const requestId = crypto.randomUUID();

    const { error } = await db
      .from("contact_requests")
      .insert({
        id: requestId,
        full_name: fullName,
        phone,
        email,
        service: serviceInterested,
        message,
      });

    if (error) throw error;

    // Handle File Uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "contact", "quotation-images", files);
    }

    // Send Notification Email
    await sendNotificationEmail({
      type: "Contact Inquiry / Consultation Request",
      name: fullName,
      phone,
      email,
      details: {
        "Service Interested": serviceInterested,
        "Message": message,
        "Uploaded Attachments": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Contact Form Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}

// 2. Submit Appointment Booking Action
export async function submitAppointmentBooking(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      selectedService: formData.get("selectedService"),
      preferredDate: formData.get("preferredDate"),
      preferredTime: formData.get("preferredTime"),
      additionalNotes: formData.get("additionalNotes") || undefined,
    };

    const validated = appointmentSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const dataObj = validated.data;
    const db = getSupabaseAdmin();
    const requestId = crypto.randomUUID();

    const { error } = await db
      .from("appointments")
      .insert({
        id: requestId,
        full_name: dataObj.fullName,
        phone: dataObj.phone,
        email: dataObj.email,
        address: dataObj.address,
        selected_service: dataObj.selectedService,
        preferred_date: dataObj.preferredDate,
        preferred_time: dataObj.preferredTime,
        additional_notes: dataObj.additionalNotes,
      });

    if (error) throw error;

    // Handle File Uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "appointment", "quotation-images", files);
    }

    // Email
    await sendNotificationEmail({
      type: "Appointment Booking",
      name: dataObj.fullName,
      phone: dataObj.phone,
      email: dataObj.email,
      details: {
        "Desired Service": dataObj.selectedService,
        "Preferred Date": dataObj.preferredDate,
        "Preferred Time": dataObj.preferredTime,
        "Site Address": dataObj.address,
        "Additional Notes": dataObj.additionalNotes || "None",
        "Uploaded Attachments": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Appointment Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}

// 3. Submit Free Consultation Action
export async function submitFreeConsultation(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      constructionType: formData.get("constructionType"),
      plotSize: formData.get("plotSize"),
      budget: formData.get("budget"),
      address: formData.get("address"),
      message: formData.get("message"),
    };

    const validated = consultationSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const dataObj = validated.data;
    const db = getSupabaseAdmin();
    
    // Generate UUID on server side
    const requestId = crypto.randomUUID();

    const { error } = await db
      .from("consultations")
      .insert({
        id: requestId,
        full_name: dataObj.fullName,
        phone: dataObj.phone,
        email: dataObj.email,
        construction_type: dataObj.constructionType,
        plot_size: dataObj.plotSize,
        budget: dataObj.budget,
        address: dataObj.address,
        message: dataObj.message,
      });

    if (error) throw error;

    // Handle File Uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "consultation", "quotation-images", files);
    }

    // Email
    await sendNotificationEmail({
      type: "Free Consultation Request",
      name: dataObj.fullName,
      phone: dataObj.phone,
      email: dataObj.email,
      details: {
        "Construction Type": dataObj.constructionType,
        "Plot Size": dataObj.plotSize,
        "Budget Range": dataObj.budget,
        "Site Address": dataObj.address,
        "Specific Ideas": dataObj.message,
        "Uploaded Attachments": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Consultation Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}

// Helper to handle multiple file uploads to storage bucket
async function uploadFiles(
  requestId: string,
  requestType: string,
  bucketName: string,
  files: File[]
): Promise<string[]> {
  const db = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.name === "undefined" || file.size === 0) continue;

    // Validate type and size
    const fileCheck = fileValidation.safeParse(file);
    if (!fileCheck.success) {
      throw new Error(`File validation failed for ${file.name}: ${fileCheck.error.issues[0].message}`);
    }

    const fileBuffer = await file.arrayBuffer();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = `${requestId}/${Date.now()}_${cleanFileName}`;

    // Upload to Storage
    const { data: uploadData, error: uploadError } = await db.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        duplex: "half",
      });

    if (uploadError) {
      console.error(`Storage upload error for ${file.name}:`, uploadError);
      throw new Error(`Failed to upload file ${file.name} to storage.`);
    }

    // Get public URL
    const { data: { publicUrl } } = db.storage.from(bucketName).getPublicUrl(filePath);

    // Save metadata in uploaded_files
    const { error: dbError } = await db.from("uploaded_files").insert({
      request_id: requestId,
      request_type: requestType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      url: publicUrl,
    });

    if (dbError) {
      console.error("Database file insertion error:", dbError);
      // Clean up uploaded file from storage if DB insertion fails
      await db.storage.from(bucketName).remove([filePath]);
      throw new Error(`Failed to store reference for ${file.name} in the database.`);
    }

    urls.push(publicUrl);
  }

  return urls;
}

// 4. Submit Quotation Request Action
export async function submitQuotationRequest(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      service: formData.get("service"),
      estimatedBudget: formData.get("estimatedBudget"),
      plotSize: formData.get("plotSize"),
      projectDescription: formData.get("projectDescription"),
    };

    const validated = quotationSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const dataObj = validated.data;
    const db = getSupabaseAdmin();
    
    // Generate UUID on server side
    const requestId = crypto.randomUUID();

    // Insert Request Record
    const { error } = await db
      .from("quotation_requests")
      .insert({
        id: requestId,
        full_name: dataObj.fullName,
        phone: dataObj.phone,
        email: dataObj.email,
        service: dataObj.service,
        estimated_budget: dataObj.estimatedBudget,
        plot_size: dataObj.plotSize,
        project_description: dataObj.projectDescription,
      });

    if (error) throw error;

    // Handle File Uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "quotation", "quotation-images", files);
    }

    // Email Notification
    await sendNotificationEmail({
      type: "Quotation Request",
      name: dataObj.fullName,
      phone: dataObj.phone,
      email: dataObj.email,
      details: {
        "Service Type": dataObj.service,
        "Estimated Budget": dataObj.estimatedBudget,
        "Plot Size": dataObj.plotSize,
        "Project Description": dataObj.projectDescription,
        "Uploaded Attachments": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true, images: uploadedUrls };
  } catch (err: any) {
    console.error("Quotation Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}

// 5. Submit Sell Property Action
export async function submitSellProperty(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      propertyType: formData.get("propertyType"),
      propertyLocation: formData.get("propertyLocation"),
      area: formData.get("area"),
      expectedPrice: formData.get("expectedPrice"),
      propertyDescription: formData.get("propertyDescription"),
    };

    const validated = sellPropertySchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const dataObj = validated.data;
    const db = getSupabaseAdmin();
    
    // Generate UUID on server side
    const requestId = crypto.randomUUID();

    // Insert Request
    const { error } = await db
      .from("sell_property_requests")
      .insert({
        id: requestId,
        full_name: dataObj.fullName,
        phone: dataObj.phone,
        email: dataObj.email,
        property_type: dataObj.propertyType,
        property_location: dataObj.propertyLocation,
        area: dataObj.area,
        expected_price: dataObj.expectedPrice,
        property_description: dataObj.propertyDescription,
      });

    if (error) throw error;

    // Handle uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "sell_property", "property-images", files);
    }

    // Email
    await sendNotificationEmail({
      type: "Sell Property Assistance",
      name: dataObj.fullName,
      phone: dataObj.phone,
      email: dataObj.email,
      details: {
        "Property Type": dataObj.propertyType,
        "Property Location": dataObj.propertyLocation,
        "Area / Size": dataObj.area,
        "Expected Price": dataObj.expectedPrice,
        "Description": dataObj.propertyDescription,
        "Uploaded Photos": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true, images: uploadedUrls };
  } catch (err: any) {
    console.error("Sell Property Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}

// 6. Submit Buy Property Action
export async function submitBuyProperty(prevState: any, formData: FormData) {
  try {
    // Honeypot Spam Protection
    if (formData.get("website")) {
      return { success: true };
    }

    // Rate Limiting Protection
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: "Too many submissions. Please wait a minute before trying again.",
      };
    }

    const rawData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      preferredLocation: formData.get("preferredLocation"),
      budget: formData.get("budget"),
      propertyType: formData.get("propertyType"),
      requirements: formData.get("requirements"),
    };

    const validated = buyPropertySchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const dataObj = validated.data;
    const db = getSupabaseAdmin();
    
    // Generate UUID on server side
    const requestId = crypto.randomUUID();

    const { error } = await db
      .from("buy_property_requests")
      .insert({
        id: requestId,
        full_name: dataObj.fullName,
        phone: dataObj.phone,
        email: dataObj.email,
        preferred_location: dataObj.preferredLocation,
        budget: dataObj.budget,
        property_type: dataObj.propertyType,
        requirements: dataObj.requirements,
      });

    if (error) throw error;

    // Handle File Uploads
    const files = formData.getAll("images") as File[];
    let uploadedUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
      uploadedUrls = await uploadFiles(requestId, "buy_property", "property-images", files);
    }

    // Email
    await sendNotificationEmail({
      type: "Buy Property Request",
      name: dataObj.fullName,
      phone: dataObj.phone,
      email: dataObj.email,
      details: {
        "Property Type": dataObj.propertyType,
        "Preferred Locations": dataObj.preferredLocation,
        "Budget Range": dataObj.budget,
        "Requirements": dataObj.requirements,
        "Uploaded Photos": uploadedUrls.length > 0 ? uploadedUrls.join(", ") : "None",
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Buy Property Action Error:", err);
    return {
      success: false,
      message: err.message || "An unexpected database error occurred. Please try again.",
    };
  }
}
