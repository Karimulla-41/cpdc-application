import nodemailer from 'nodemailer';

interface SendODListEmailOptions {
  recipientEmail: string;
  subject: string;
  eventName: string;
  eventDate: string;
  venue: string;
  students: Array<{
    name: string;
    studentId: string;
    department: string;
  }>;
}

export async function sendODListEmail({
  recipientEmail,
  subject,
  eventName,
  eventDate,
  venue,
  students,
}: SendODListEmailOptions): Promise<{ success: boolean; messageId?: string; previewMode?: boolean }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'CPDC Official <noreply@cpdc.edu.in>';

  const studentRowsHtml = students
    .map(
      (s, index) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${index + 1}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">${s.name}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${s.studentId || 'N/A'}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0;">${s.department || 'N/A'}</td>
    </tr>`
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background-color: #1e4279; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Career & Professional Development Club (CPDC)</h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Official On-Duty (OD) Recommendation List</p>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="font-size: 18px; color: #1e4279; margin-top: 0;">${eventName}</h2>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Venue:</strong> ${venue}</p>
          <p>The following students have actively participated in / organized the above CPDC event and are hereby recommended for On-Duty (OD) attendance permission:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: left;">
                <th style="padding: 10px; border: 1px solid #e2e8f0;">#</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">Student Name</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">Student ID</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0;">Department</th>
              </tr>
            </thead>
            <tbody>
              ${studentRowsHtml}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #1e4279; font-size: 13px; color: #64748b;">
            <p style="margin: 0;">This is an officially dispatched email from CPDC Management. For queries, please contact the Staff Coordinator office.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Fallback mode if SMTP credentials are missing in local dev
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('\n--- [CPDC EMAIL DISPATCH - PREVIEW MODE] ---');
    console.log(`To: ${recipientEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Event: ${eventName} (${eventDate} at ${venue})`);
    console.log(`Students (${students.length}):`, students.map(s => `${s.name} (${s.studentId})`).join(', '));
    console.log('--------------------------------------------\n');
    return { success: true, previewMode: true };
  }

  // Real SMTP transport
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const info = await transporter.sendMail({
    from: smtpFrom,
    to: recipientEmail,
    subject: subject,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}
