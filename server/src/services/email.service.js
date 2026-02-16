const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send donation receipt email
exports.sendDonationReceipt = async (donor, donation, program) => {
  try {
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .receipt-box { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .amount { font-size: 32px; color: #667eea; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .tax-info { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You for Your Donation!</h1>
            <p>Mars Care Foundation</p>
          </div>
          <div class="content">
            <p>Dear <strong>${donor.name}</strong>,</p>
            <p>Thank you for your generous donation to Mars Care Foundation. Your support helps us continue our mission of creating positive change in communities.</p>
            
            <div class="receipt-box">
              <h3>Donation Receipt</h3>
              <p><strong>Receipt Number:</strong> ${donation.receipt?.number || 'N/A'}</p>
              <p><strong>Date:</strong> ${new Date(donation.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Donation Amount:</strong></p>
              <p class="amount">₹${donation.amount.toLocaleString('en-IN')}</p>
              ${program ? `<p><strong>Program:</strong> ${program.title}</p>` : ''}
              <p><strong>Transaction ID:</strong> ${donation.transactionId || 'N/A'}</p>
            </div>

            ${donor.panNumber ? `
            <div class="tax-info">
              <h4>80G Tax Benefit</h4>
              <p>Your donation is eligible for tax exemption under Section 80G of the Income Tax Act.</p>
              <p><strong>PAN:</strong> ${donor.panNumber}</p>
              <p>Please keep this receipt for your tax records.</p>
            </div>
            ` : ''}

            <p>Your contribution directly supports:</p>
            <ul>
              <li>Education for underprivileged children</li>
              <li>Healthcare initiatives in rural areas</li>
              <li>Community development programs</li>
            </ul>

            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>With gratitude,<br><strong>Team Mars Care Foundation</strong></p>
          </div>
          <div class="footer">
            <p>Mars Care Foundation | info@marscarefoundation.org</p>
            <p>This is an auto-generated receipt. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Mars Care Foundation <onboarding@resend.dev>',
      to: donor.email,
      subject: `Thank You for Your Donation - Receipt #${donation.receipt?.number || 'N/A'}`,
      html: receiptHtml
    });

    console.log(`Donation receipt sent to ${donor.email}`);
    return true;
  } catch (error) {
    console.error('Error sending donation receipt:', error);
    return false;
  }
};

// Send volunteer confirmation email
exports.sendVolunteerConfirmation = async (volunteer) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Mars Care Foundation! 🌟</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${volunteer.name}</strong>,</p>
            <p>Thank you for registering as a volunteer with Mars Care Foundation!</p>
            <p>We have received your application and our team will review it shortly. We will contact you within 3-5 business days to discuss the next steps.</p>
            <p><strong>Your Skills:</strong> ${volunteer.skills.join(', ')}</p>
            <p><strong>Availability:</strong> ${volunteer.availability}</p>
            <p>In the meantime, follow us on social media to stay updated with our latest activities.</p>
            <p>Best regards,<br><strong>Team Mars Care Foundation</strong></p>
          </div>
          <div class="footer">
            <p>Mars Care Foundation | volunteers@marscarefoundation.org</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Mars Care Foundation <onboarding@resend.dev>',
      to: volunteer.email,
      subject: 'Welcome to Mars Care Foundation - Volunteer Registration Received',
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending volunteer confirmation:', error);
    return false;
  }
};

// Send volunteer approval email
exports.sendVolunteerApproval = async (volunteer) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cta-button { display: inline-block; background-color: #10B981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to the Team!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${volunteer.name}</strong>,</p>
            <p>Congratulations! We are thrilled to inform you that your application to volunteer with Mars Care Foundation has been <strong>approved</strong>.</p>
            <p>We were impressed by your passion and skills, and we believe you will be a valuable addition to our family.</p>
            
            <h3>What's Next?</h3>
            <p>Our volunteer coordinator will be in touch with you shortly to orient you and assign your first task based on your skills and availability.</p>
            
            <p>We look forward to making a difference together!</p>
            
            <p>Best regards,<br><strong>Team Mars Care Foundation</strong></p>
          </div>
          <div class="footer">
            <p>Mars Care Foundation | volunteers@marscarefoundation.org</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Mars Care Foundation <onboarding@resend.dev>',
      to: volunteer.email,
      subject: 'Application Approved! Welcome to Mars Care Foundation',
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending volunteer approval:', error);
    return false;
  }
};

// Send volunteer assignment email
exports.sendVolunteerAssignment = async (volunteer, assignment, programTitle) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .label { font-weight: bold; color: #666; font-size: 0.9em; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Volunteer Assignment 📋</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${volunteer.name}</strong>,</p>
            <p>You have been assigned a new task at Mars Care Foundation.</p>
            
            <div class="task-box">
              <p><span class="label">TASK:</span><br><strong style="font-size: 1.2em;">${assignment.task}</strong></p>
              ${programTitle ? `<p><span class="label">PROGRAM:</span><br>${programTitle}</p>` : ''}
              ${assignment.description ? `<p><span class="label">DESCRIPTION:</span><br>${assignment.description}</p>` : ''}
              ${assignment.dueDate ? `<p><span class="label">DUE DATE:</span><br>${new Date(assignment.dueDate).toLocaleDateString()}</p>` : ''}
              ${assignment.notes ? `<p><span class="label">NOTES:</span><br>${assignment.notes}</p>` : ''}
            </div>

            <p>Please reply to this email or contact your coordinator if you have any questions.</p>
            
            <p>Thank you for your dedication!</p>
            
            <p>Best regards,<br><strong>Team Mars Care Foundation</strong></p>
          </div>
          <div class="footer">
            <p>Mars Care Foundation | volunteers@marscarefoundation.org</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Mars Care Foundation <onboarding@resend.dev>',
      to: volunteer.email,
      subject: `New Assignment: ${assignment.task}`,
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending volunteer assignment:', error);
    return false;
  }
};

// Send contact form acknowledgment
exports.sendContactAcknowledgment = async (contact) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${contact.name},</p>
        <p>We have received your message regarding "${contact.subject}". Our team will review it and get back to you within 24-48 hours.</p>
        <p>Best regards,<br>Mars Care Foundation</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Mars Care Foundation <onboarding@resend.dev>',
      to: contact.email,
      subject: 'We received your message - Mars Care Foundation',
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending contact acknowledgment:', error);
    return false;
  }
};
