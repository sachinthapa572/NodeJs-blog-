const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.HOST_EMAIL,
                pass: process.env.HOST_EMAIL_PASSWORD,
            },
        });

        // Define the email options with HTML content
        const mailOptions = {
            from: `${process.env.HOST_NAME} <${process.env.HOST_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="cid:logo" alt="NodeBlog" style="max-width: 150px;"/>
                    </div>
                    <h2 style="text-align: center; color: #333;">Password Reset</h2>
                    <p style="font-size: 16px; color: #333;">
                        It seems like you requested a password reset for NodeBlog. If this is true, use the OTP below to verify your identity.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <button style="background-color: #007bff; color: white; padding: 12px 20px; font-size: 18px; border: none; border-radius: 5px; cursor: default;">
                            ${options.otp}
                        </button>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #666;">
                        Thanks,<br/>
                        The NodeBlog Team
                    </p>
                    <p style="text-align: center; font-size: 12px; color: #aaa;">
                        Sachin Thapa , Nepal
                    </p>
                </div>
            `,
            attachments: [{
                filename: 'logo.png',
                path: "public\\images\\logo.png",
                cid: 'logo' // same cid value as in the html img src
            }]
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
        throw new Error("Failed to send email. Please try again later.");
    }
};

module.exports = sendEmail;
