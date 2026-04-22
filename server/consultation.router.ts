import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  saveConsultationBooking,
  getConsultationBookingsByUserId,
  getAllConsultationBookings,
  updateConsultationBookingStatus,
} from "./db";

export const consultationRouter = router({
  /**
   * Save consultation booking
   */
  saveBooking: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(10, "Valid phone number is required"),
        consultationContent: z.string().optional(),
        recordingUrl: z.string().optional(),
        recordingDuration: z.number().optional(),
        fileUrls: z.string().optional(), // JSON array
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await saveConsultationBooking({
        userId: ctx.user.id,
        name: input.name,
        phone: input.phone,
        consultationContent: input.consultationContent,
        recordingUrl: input.recordingUrl,
        recordingDuration: input.recordingDuration,
        fileUrls: input.fileUrls,
      });
      return result;
    }),

  /**
   * Get consultation bookings by user ID
   */
  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    const bookings = await getConsultationBookingsByUserId(ctx.user.id);
    return bookings;
  }),

  /**
   * Get all consultation bookings (admin only)
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
      throw new Error("Unauthorized: Only admins can view all bookings");
    }
    const bookings = await getAllConsultationBookings();
    return bookings;
  }),

  /**
   * Update consultation booking status (admin only)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "owner") {
        throw new Error("Unauthorized: Only admins can update bookings");
      }
      const result = await updateConsultationBookingStatus(
        input.bookingId,
        input.status
      );
      return result;
    }),
});
