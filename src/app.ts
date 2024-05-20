import express from "express";
import "dotenv/config";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

const app = express();

app.use((_, res, next) => {
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,OPTIONS,PATCH,DELETE,POST,PUT",
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
	);
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/send-email", async ({ body }, res) => {
	const { name, email, message: text } = body;

	try {
		// Configuração do transporte
		const transporter = nodemailer.createTransport({
			service: "outlook",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL,
			to: process.env.EMAIL,
			subject: `Mensagem de "${name.toUpperCase()}" | Portfólio`,
			replyTo: email,
			text,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).send("Email enviado com sucesso!");
	} catch (error) {
		console.error("Erro ao enviar email:", error);
		res.status(500).send("Erro ao enviar email");
	}
});

export { app };
