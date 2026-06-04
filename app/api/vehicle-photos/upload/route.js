import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const keyRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.includes("service_role")
      ? "service_role"
      : "unknown";

    console.log("UPLOAD DEBUG:", {
      hasUrl,
      hasService,
      keyRole,
    });

    if (!hasUrl || !hasService) {
      return NextResponse.json({
        error: "Missing Supabase env variables",
        debug: { hasUrl, hasService, keyRole },
      }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const formData = await request.formData();
    const files = formData.getAll("photos");

    console.log("FILES RECEIVED:", files.length);

    if (!files.length) {
      return NextResponse.json({
        error: "No photos uploaded",
        debug: { fileCount: 0 },
      }, { status: 400 });
    }

    const testList = await supabase.storage.from("vehicle-photos").list("", {
      limit: 1,
    });

    console.log("BUCKET LIST TEST:", testList);

    const urls = [];

    for (const file of files) {
      const ext = String(file.name || "photo.jpg").split(".").pop() || "jpg";
      const path = `vehicles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      console.log("TRYING UPLOAD:", {
        bucket: "vehicle-photos",
        path,
        fileType: file.type,
        fileSize: file.size,
      });

      const { data, error } = await supabase.storage
        .from("vehicle-photos")
        .upload(path, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("UPLOAD ERROR FULL:", error);

        return NextResponse.json({
          error: error.message,
          debug: {
            name: error.name || null,
            statusCode: error.statusCode || null,
            status: error.status || null,
            cause: error.cause || null,
            fullError: error,
            env: {
              hasUrl,
              hasService,
              keyRole,
            },
            bucketListTest: testList,
          },
        }, { status: 500 });
      }

      console.log("UPLOAD SUCCESS:", data);

      const { data: publicData } = supabase.storage
        .from("vehicle-photos")
        .getPublicUrl(path);

      urls.push(publicData.publicUrl);
    }

    return NextResponse.json({
      success: true,
      urls,
      debug: {
        hasUrl,
        hasService,
        keyRole,
        bucketListTest: testList,
      },
    });
  } catch (error) {
    console.error("UPLOAD ROUTE CRASH:", error);

    return NextResponse.json({
      error: error?.message || String(error),
      debug: {
        name: error?.name || null,
        stack: error?.stack || null,
      },
    }, { status: 500 });
  }
}