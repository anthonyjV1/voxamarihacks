import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.actions";

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }
    
    // Update the user document to premium
    await db.collection("users").doc(currentUser.id).update({
      plan: "premium"
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update plan" },
      { status: 500 }
    );
  }
}