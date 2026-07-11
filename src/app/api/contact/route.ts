import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        // Estrai sourceForm o imposta un default
        const sourceForm = data.sourceForm || 'Sconosciuto';
        // Rimuovi sourceForm dai dati per non ciclarlo come campo del form (opzionale)
        const { sourceForm: _, ...formData } = data;

        // Configure nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'camata28@gmail.com',
                pass: 'soniyzzvewgsfrjh' // Usa la password per le app pre-esistente
            }
        });

        // Crea HTML dinamico
        let htmlBody = `<h2>Nuova Richiesta da: ${sourceForm}</h2>`;
        for (const [key, value] of Object.entries(formData)) {
            htmlBody += `<p><strong>${key}:</strong> ${value}</p>`;
        }

        // Email options
        const mailOptions = {
            from: '"EdilManager24" <camata28@gmail.com>', // Mittente con Nome
            to: 'a.camata@rifacciamocasa.com', // Destinatario finale
            subject: `Nuova Richiesta - Sezione: ${sourceForm}`,
            html: htmlBody
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
    }
}

