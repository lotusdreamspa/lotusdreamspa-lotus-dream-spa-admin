module.exports = {
  async beforeUpdate(event) {
    const { where, data } = event.params;

    if (data.bookingStatus === 'confirmed') {
      try {
        const entry = await strapi.entityService.findOne('api::booking.booking', where.id, {
          populate: ['customer', 'treatment'],
        });

        if (
          entry &&
          entry.bookingStatus !== 'confirmed' &&
          entry.customer &&
          entry.customer.email
        ) {
          
          // --- DATI ---
          const treatmentName = entry.treatment ? entry.treatment.title : 'General Massage';
          const bookingPrice = entry.price ? `$${entry.price}` : 'Check at reception';
          const bookingDuration = entry.duration ? `${entry.duration} mins` : '-';
          
          const bookingDate = entry.date || 'TBD'; 
          const bookingTime = entry.time ? entry.time.slice(0, 5) : 'TBD';

          // URL LOGO (Sostituisci con il tuo link reale)
          const logoUrl = 'https://respected-cherry-3bae02ef27.media.strapiapp.com/logo_a65400de7e.png'; 
          const mapLink = "https://www.google.com/maps/search/?api=1&query=Lotus+Dream+Spa+Siem+Reap";

          // --- INVIO MAIL ---
          await strapi.plugins['email'].services.email.send({
            to: entry.customer.email,
            from: 'lotusdreamspa.sr@gmail.com', 
            replyTo: 'lotusdreamspa.sr@gmail.com',
            bcc: 'lotusdreamspa.sr@gmail.com',
            
            subject: 'Booking Confirmed - Lotus Dream Spa 🌸',
            text: `Dear Guest, your appointment is confirmed.`,
            
            // 👇 QUI C'È LA MAGIA DELLO SFONDO
            html: `
              <div style="background-color: #1f3a5c; padding: 40px 0; width: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                
                <div style="background-color: #1f3a5c; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                  
                  <div style="text-align: center; padding: 30px 0 10px 0;">
                    <img src="${logoUrl}" alt="Lotus Dream Spa" style="width: 100px; height: auto;" />
                  </div>

                  <div style="text-align: center; padding: 0 20px;">
                    <h2 style="color: #0AE072; margin-bottom: 5px; font-size: 32px;">Booking Confirmed</h2>
                    <p style="color: #ffffff; font-size: 16px; margin-top: 0;">We are waiting for you, dear Guest.</p>
                  </div>

                  <div style="padding: 20px 40px;">
                    <div style="background-color: #fdfdfd; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                      <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Appointment Details</h3>
                      
                      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                        <tr>
                          <td style="padding: 10px 0; color: #888;">Treatment</td>
                          <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #333;">${treatmentName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #888; border-top: 1px solid #f5f5f5;">Date</td>
                          <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #333; border-top: 1px solid #f5f5f5;">${bookingDate}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #888; border-top: 1px solid #f5f5f5;">Time</td>
                          <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #333; border-top: 1px solid #f5f5f5;">${bookingTime}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #888; border-top: 1px solid #f5f5f5;">Duration</td>
                          <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #333; border-top: 1px solid #f5f5f5;">${bookingDuration}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #888; border-top: 1px solid #f5f5f5;">Price</td>
                          <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #d63384; border-top: 1px solid #f5f5f5;">${bookingPrice}</td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <div style="text-align: center; padding-bottom: 40px;">
                    <a href="${mapLink}" target="_blank" style="background-color: #00BBFF; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">📍 Get Directions</a>
                  </div>

                </div> <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                <p><strong>Lotus Dream Spa</strong><br>676 Hap Guan St, Krong Siem Reap 17252, Siem Reap, Cambodia</p>
                </div>

              </div>`,
          });

          strapi.log.info(`Spa Confirmation Email sent to ${entry.customer.email}`);
        }
      } catch (err) {
        strapi.log.error('Error sending Spa confirmation email:', err);
      }
    }
  },
};