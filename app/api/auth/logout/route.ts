import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Cookies cleared successfully",
    });

    // List of common auth cookies to delete
    const authCookies = [
      "session",
      "token",
      "authToken",
      "firebaseToken",
      "idToken",
    ];

    // Delete each cookie by setting it with empty value and maxAge 0
    authCookies.forEach((name) => {
      response.cookies.set(name, "", {
        path: "/",
        maxAge: 0,
      });
    });

    return response;
  } catch (error: unknown) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to clear cookies: ${"Error"}`,
      },
      { status: 500 }
    );
  }
}
