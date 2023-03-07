import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const nameOrCompany = req.body.nameOrCompany || '';
  if (nameOrCompany.trim().length === 0){
    res.status(400).json({
      error: {
        message: "Please enter a valid name or company",
      }
    });
    return
  }

  const basicAnswer = req.body.basicAnswer || '';
  if (basicAnswer.trim().length === 0){
    res.status(400).json({
      error: {
        message: "Please enter a basic anwser",
      }
    });
    return
  }

  const emailText = req.body.emailText || '';
  if (emailText.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid email content",
      }
    });
    return;
  } 

  ////////////////////////

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(nameOrCompany,basicAnswer,emailText),
      temperature: 0.6,
      max_tokens: 2048,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(nameOrCompany,basicAnswer,emailText) {
  let capitalizedName = nameOrCompany;
  let capitalizedBasicAnswer = basicAnswer;
  let capitalizedEmailText = emailText;

  return `Act as an AI-powered Professional Email Generator, Answer the following email like a formal human using basic answer information, write a professional formal message in the language you receive the Formalemail. You must be able to understand the context of the email to reply to it.

Name: Pedro Laterza.
Basic answer: yes we can schedule a call.
Email: Dear Pedro Laterza,

I hope this email finds you well. I wanted to inquire about your company's services and how they can benefit my business. Please let me know if we can schedule a call to discuss further. Thank you.

Best Regards,
John Smith.

Formalemail: Dear John Smith,

Thank you for reaching out to me. I am Pedro Laterza, and I appreciate your interest in our company's services.

I would be happy to discuss how our services can benefit your business in more detail. Please let me know your availability for a call, and we can schedule a time that works best for both of us.

Thank you again for considering our company, and I look forward to speaking with you soon

Best regards,
Pedro Laterza.
###
Name: Fernanda Barros.
Basic answer: thanks for you application i'll be I will be reviewing your resume.
Email: I am writing to apply for the open position of Marketing Manager at your company. I am excited about the opportunity to join your team and help drive growth for your brand. With 5 years of experience in marketing and a proven track record of success, I believe that I would be an asset to your organization.

In my previous role at XYZ Company, I led a team of marketing professionals to develop and execute successful campaigns across multiple channels. I am highly skilled in digital marketing, including social media, email marketing, and content creation. I am also experienced in event planning and traditional advertising methods. I am confident that my skills and experience make me an ideal candidate for this position.

Thank you for considering my application. I look forward to the opportunity to discuss my qualifications further in an interview.

Sincerely,
Jonas Ferreira

Formalemail: Dear Jonas Ferreira,

Thank you for your interest in the Marketing Manager position at our company. I am grateful for your application and appreciate the time and effort you put into your submission. I would like to confirm that I have received your resume and will be reviewing it in the coming days.

Your experience in marketing, particularly your success in developing and executing campaigns across multiple channels, caught my attention. Your skills in digital marketing, event planning, and traditional advertising methods align well with the requirements of this role.

We are currently reviewing applications and will be in touch with qualified candidates for further steps in the interview process. If you are selected for an interview, we will contact you to schedule a time and provide additional details about the next steps.

Once again, thank you for your interest in our company and for applying for this position. We appreciate your interest and look forward to reviewing your application.

Best regards,
Fernanda Barros
Hiring Manager
##
Name: 

Name: """${capitalizedName}."""
Basic Answer: """${capitalizedBasicAnswer}."""
Email:"""${capitalizedEmailText}"""
Formalemail: `
};

