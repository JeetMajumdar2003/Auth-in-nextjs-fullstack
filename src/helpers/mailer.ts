import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userID }: { email: string, emailType: string, userID: string }) => {
    try {
        // TODO: configure your mail for uses
        // Hash the user ID to create a unique token, which will be used as verifyToken and forgotPasswordToken
        const hashedToken = await bcryptjs.hash(userID.toString(), 10);

        // Configure sending email to the user
        if (emailType === "VERIFY_EMAIL") {
            await User.findByIdAndUpdate(
                userID,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpires: Date.now() + 3600000, // 1 hour
                }
            )
        } else if (emailType === "RESET_PASSWORD") {
            await User.findByIdAndUpdate(
                userID,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 600000, // 10 minutes
                }
            )
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: 'jeet.majumdar@microsoft.com', // sender address
            to: email, // receiver address
            subject: emailType === "VERIFY_EMAIL" ? "Verify your email" : "Reset your password", // Subject line
            html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <title>${emailType === "VERIFY_EMAIL" ? "Verify Your Email" : "Reset Your Password"}</title>
                        <style type="text/css">
                            /* Universal reset */
                            body, p, h1, h2, h3, h4, h5, h6 {
                                margin: 0;
                                padding: 0;
                            }
                            img {
                                display: block;
                                border: 0;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 16px;
                                line-height: 1.6;
                                color: #333333;
                                background-color: #f4f4f4;
                                padding: 0;
                                margin: 0;
                                -webkit-font-smoothing: antialiased;
                                width: 100%;
                            }
                            /* Container */
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 10px;
                                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
                            }
                            /* Header */
                            .header {
                                background-color: #007bff;
                                padding: 20px;
                                text-align: center;
                                border-top-left-radius: 10px;
                                border-top-right-radius: 10px;
                            }
                            .header img {
                                max-width: 120px;
                                margin-bottom: 15px;
                            }
                            .header h1 {
                                color: #ffffff;
                                font-size: 26px;
                                font-weight: bold;
                                margin: 0;
                            }
                            /* Content */
                            .content {
                                padding: 30px;
                                text-align: left;
                                color: #555555;
                            }
                            .content p {
                                font-size: 16px;
                                margin-bottom: 20px;
                            }
                            .content p.lead {
                                font-size: 18px;
                                font-weight: bold;
                                color: #333333;
                            }
                            .content .highlight {
                                background-color: #f9f9f9;
                                padding: 15px;
                                border-radius: 8px;
                                font-family: 'Courier New', Courier, monospace;
                                word-break: break-word;
                            }
                            /* Button */
                            .button {
                                display: inline-block;
                                padding: 14px 28px;
                                color: #ffffff;
                                background-color: #007bff;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 16px;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            /* Footer */
                            .footer {
                                text-align: center;
                                padding: 20px;
                                font-size: 12px;
                                color: #777777;
                                background-color: #f4f4f4;
                                border-bottom-left-radius: 10px;
                                border-bottom-right-radius: 10px;
                            }
                            .footer p {
                                margin: 5px 0;
                            }
                            .footer a {
                                color: #007bff;
                                text-decoration: none;
                            }
                            .footer a:hover {
                                text-decoration: underline;
                            }
                            /* Responsive */
                            @media only screen and (max-width: 600px) {
                                .container {
                                    width: 100% !important;
                                    padding: 15px;
                                }
                                .content {
                                    padding: 20px;
                                }
                                .button {
                                    width: 100%;
                                    padding: 14px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <!-- Header -->
                            <div class="header">
                                <img src="E:/SKILLS/HITESH SIR Youtube/NextJS By Hitesh Sir/Auth in NextJS/auth-in-nextjs/public/next.svg" alt="Company Logo">
                                <h1>${emailType === "VERIFY_EMAIL" ? "Verify Your Email Address" : "Reset Your Password"}</h1>
                            </div>

                            <!-- Content -->
                            <div class="content">
                                <p class="lead">Dear User,</p>
                                <p>We received a request to ${emailType === "VERIFY_EMAIL" ? "verify your email address" : "reset your password"}. Please click the button below to complete the process:</p>
                                <p style="text-align: center;">
                                    <a href="${process.env.DOMAIN}/${emailType === "VERIFY_EMAIL" ? "verify-email" : "reset-password"}?token=${hashedToken}" class="button">
                                        ${emailType === "VERIFY_EMAIL" ? "Verify Email" : "Reset Password"}
                                    </a>
                                </p>
                                <p>If the button above doesn’t work, please copy and paste the link below into your browser:</p>
                                <p class="highlight">${process.env.DOMAIN}/${emailType === "VERIFY_EMAIL" ? "verify-email" : "reset-password"}?token=${hashedToken}</p>
                                <p>This link will expire in 24 hours for security reasons. If you didn’t request this, you can safely ignore this email or contact our support.</p>
                                <p>Best regards,<br>The Security Team</p>
                            </div>

                            <!-- Footer -->
                            <div class="footer">
                                <p>&copy; ${new Date().getFullYear()} JEET's ORG. All rights reserved.</p>
                                <p>123 Main Street, City, State, ZIP</p>
                                <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    `,  // email body
        }

        const info = await transport.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        return mailOptions;
    } catch (error: any) {
        throw new Error(error.message);
    }
}