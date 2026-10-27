import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  // Validate shared secret token
  const expectedSecret = process.env.REVALIDATION_SECRET_TOKEN || "raj-portfolio-revalidate-secret-token";

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, message: "Invalid revalidation secret token." },
      { status: 401 }
    );
  }

  if (tag) {
    (revalidateTag as any)(tag);
    return NextResponse.json({
      success: true,
      message: `Cache tag '${tag}' revalidated successfully.`,
      now: Date.now(),
    });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({
      success: true,
      message: `Path '${path}' revalidated successfully.`,
      now: Date.now(),
    });
  }

  // Fallback revalidate homepage
  revalidatePath("/");
  return NextResponse.json({
    success: true,
    message: "Root homepage revalidated successfully.",
    now: Date.now(),
  });
}
