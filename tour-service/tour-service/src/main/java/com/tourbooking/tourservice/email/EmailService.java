package com.tourbooking.tourservice.email;

import com.tourbooking.tourservice.model.Booking;
import com.tourbooking.tourservice.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    // Booking confirmation email
    public void sendBookingConfirmationEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            User user = booking.getUser();
            String tourTitle = booking.getTour().getTitle();
            String destination = booking.getTour().getDestination();
            int seats = booking.getNumberOfSeats();
            double totalPrice = booking.getTotalPrice();
            String bookingId = String.valueOf(booking.getId());

            // Email content
            String subject = "Booking Confirmation - " + tourTitle;
            String htmlContent = buildBookingConfirmationHtml(
                    user.getName(),
                    tourTitle,
                    destination,
                    seats,
                    totalPrice,
                    bookingId,
                    booking.getTour().getStartDate().toString()
            );

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Booking confirmation email sent to: " + user.getEmail());

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }

    // Booking cancellation email
    public void sendBookingCancellationEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            User user = booking.getUser();
            String tourTitle = booking.getTour().getTitle();
            String bookingId = String.valueOf(booking.getId());

            String subject = "Booking Cancelled - " + tourTitle;
            String htmlContent = buildBookingCancellationHtml(
                    user.getName(),
                    tourTitle,
                    bookingId
            );

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Cancellation email sent to: " + user.getEmail());

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }

    // HTML template for confirmation email
    private String buildBookingConfirmationHtml(String userName, String tourTitle,
                                                String destination, int seats,
                                                double totalPrice, String bookingId,
                                                String startDate) {
        DecimalFormat df = new DecimalFormat("#,##0.00");

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }" +
                ".detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }" +
                ".label { font-weight: bold; color: #667eea; }" +
                ".value { color: #333; }" +
                ".total { font-size: 1.3em; color: #667eea; font-weight: bold; }" +
                ".button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }" +
                ".footer { text-align: center; margin-top: 30px; color: #999; font-size: 0.9em; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>🎉 Booking Confirmed!</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>" + userName + "</strong>,</p>" +
                "<p>Your booking has been confirmed successfully! We're excited to have you join us.</p>" +
                "<div class='booking-details'>" +
                "<h3>📋 Booking Details</h3>" +
                "<div class='detail-row'><span class='label'>Booking ID:</span><span class='value'>#" + bookingId + "</span></div>" +
                "<div class='detail-row'><span class='label'>Tour:</span><span class='value'>" + tourTitle + "</span></div>" +
                "<div class='detail-row'><span class='label'>Destination:</span><span class='value'>" + destination + "</span></div>" +
                "<div class='detail-row'><span class='label'>Start Date:</span><span class='value'>" + startDate + "</span></div>" +
                "<div class='detail-row'><span class='label'>Number of Seats:</span><span class='value'>" + seats + "</span></div>" +
                "<div class='detail-row'><span class='label'>Total Amount:</span><span class='value total'>₹" + df.format(totalPrice) + "</span></div>" +
                "</div>" +
                "<p style='color: #ff6b6b;'><strong>⚠️ Important:</strong> Please complete your payment to confirm your booking.</p>" +
                "<a href='" + baseUrl + "/api/bookings/" + bookingId + "' class='button'>View Booking Details</a>" +
                "<p>If you have any questions, feel free to contact our support team.</p>" +
                "<div class='footer'>" +
                "<p>Thank you for choosing our service!</p>" +
                "<p style='font-size: 0.8em;'>This is an automated email. Please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // HTML template for cancellation email
    private String buildBookingCancellationHtml(String userName, String tourTitle, String bookingId) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b; }" +
                ".footer { text-align: center; margin-top: 30px; color: #999; font-size: 0.9em; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>❌ Booking Cancelled</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear <strong>" + userName + "</strong>,</p>" +
                "<p>Your booking has been cancelled as per your request.</p>" +
                "<div class='info-box'>" +
                "<h3>Cancelled Booking Details</h3>" +
                "<p><strong>Booking ID:</strong> #" + bookingId + "</p>" +
                "<p><strong>Tour:</strong> " + tourTitle + "</p>" +
                "</div>" +
                "<p>If you cancelled by mistake or would like to rebook, please visit our website.</p>" +
                "<p><strong>Refund Policy:</strong> If payment was made, the refund will be processed within 5-7 business days.</p>" +
                "<div class='footer'>" +
                "<p>We hope to serve you again soon!</p>" +
                "<p style='font-size: 0.8em;'>This is an automated email. Please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}