module.exports = {
  async beforeUpdate(event) {
    const { where, data } = event.params;

    // Check if the status is changing to 'confirmed'
    if (data.bookingStatus === 'confirmed') {
      try {
        // Fetch booking with customer and treatment details
        const entry = await strapi.entityService.findOne('api::booking.booking', where.id, {
          populate: ['customer', 'treatment'],
        });

        // Security checks
        if (
          entry &&
          entry.bookingStatus !== 'confirmed' && // Prevent double sending
          entry.customer &&
          entry.customer.email
        ) {
          
          // Safely extract treatment data
          const treatmentName = entry.treatment ? entry.treatment.name : 'General Massage';
          const treatmentPrice = entry.treatment ? entry.treatment.price : 0;
          
          // Format Price (assuming USD for Cambodia/Siem Reap)
          const formattedPrice = `$${treatmentPrice}`;

          // Send the email in English
          await strapi.plugins['email'].services.email.send({
            to: entry.customer.email,
            from: 'lotusdreamspa.sr@gmail.com', // 🔴 CAMBIAMI con la tua mail reale
            replyTo: 'lotusdreamspa.sr@gmail.com',
            bcc: 'lotusdreamspa.sr@gmail.com',
            subject: 'Booking Confirmed - Lotus Dream Spa 🌸',
            text: `Dear ${entry.customer.name}, your appointment for "${treatmentName}" is confirmed. Price: ${formattedPrice}. See you soon at Lotus Dream Spa!`,
            html: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4a4a4a; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                
                <div style="text-align: center; padding: 20px 0;">
                  <h2 style="color: #d63384; margin-bottom: 5px;">Booking Confirmed</h2>
                  <p style="font-size: 16px; margin-top: 0;">Get ready to relax, ${entry.customer.name}.</p>
                </div>

                <div style="background-color: #fcfcfc; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Appointment Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #888;">Treatment:</td>
                      <td style="padding: 8px 0; font-weight: bold; text-align: right;">${treatmentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #888;">Price:</td>
                      <td style="padding: 8px 0; font-weight: bold; text-align: right;">${formattedPrice}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #888;">Status:</td>
                      <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #2ecc71;">Confirmed ✅</td>
                    </tr>
                  </table>
                </div>

                <div style="text-align: center; color: #888; font-size: 14px; margin-top: 30px;">
                  <p>We look forward to welcoming you.</p>
                  <p><strong>Lotus Dream Spa</strong><br>Siem Reap, Cambodia</p>
                </div>
              </div>
            `,
          });

          strapi.log.info(`Spa Confirmation Email sent to ${entry.customer.email} for booking #${entry.id}`);
        }
      } catch (err) {
        strapi.log.error('Error sending Spa confirmation email:', err);
      }
    }
  },
};