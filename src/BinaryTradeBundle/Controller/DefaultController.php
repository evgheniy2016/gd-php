<?php

namespace BinaryTradeBundle\Controller;

use BinaryTradeBundle\Form\VerificationFilesType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        $assetRepository = $this->getDoctrine()->getRepository('AppBundle:Asset');
        $assets = $assetRepository->findAll();

        return $this->render('BinaryTradeBundle:Default:index.html.twig', [
            'assets' => $assets
        ]);
    }

    /**
     * @Route("/foo")
     */
    public function fooAction()
    {
        $users = $this->getDoctrine()->getRepository('AppBundle:User')->findAll();
        $data = [];
        foreach ($users as $user) {
            array_push($data, $user->getFirstName());
        }
        return new JsonResponse($data);
    }

    /**
     * @Route("/contact-us", name="contact-us")
     */
    public function contactUsAction(Request $request)
    {
        $name = $request->get('username');
        $email = $request->get('email');
        $subject = $request->get('subject');
        $content = $request->get('content');

        $message = \Swift_Message::newInstance()
            ->setFrom($_SERVER['MAILER_TO'])
            ->setTo($_SERVER['MAILER_TO'])
            ->setSubject('Новое сообщение формы обратной связи: ' . $subject)
            ->setBody($content);

        $transporter = \Swift_SmtpTransport::newInstance($_SERVER['MAILER_HOST'], $_SERVER['MAILER_PORT'], 'tls')
            ->setUsername($_SERVER['MAILER_USER'])
            ->setPassword($_SERVER['MAILER_PASSWORD']);

        $mailer = \Swift_Mailer::newInstance($transporter);

        $mailer->send($message);

        return $this->render('BinaryTradeBundle:Default:contact_us.html.twig', [  ]);
    }

    /**
     * @Route("/email")
     */
    public function sendEmail(Request $request) {
        $data = [
            'file_one' => null,
            'file_two' => null
        ];

        $form = $this->createForm(VerificationFilesType::class, $data);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $message = \Swift_Message::newInstance()
                ->setFrom('noreply@goldenforex.com')
                ->setTo('alexey.rudkovskiy@mitk.com.ua')
                ->setSubject('test')
                ->setBody('Hello world!');

            /** @var UploadedFile $fileOne */
            $fileOne = $form->get('file_one')->getData();
            /** @var UploadedFile $fileTwo */
            $fileTwo = $form->get('file_two')->getData();

            $attachment = \Swift_Attachment::fromPath($fileOne->getRealPath())->setFilename($fileOne->getClientOriginalName());
            $message->attach($attachment);

            $attachment = \Swift_Attachment::fromPath($fileTwo->getRealPath())->setFilename($fileTwo->getClientOriginalName());
            $message->attach($attachment);

            $this->get('mailer')->send($message);
        }

        return $this->render('BinaryTradeBundle:Default:send_email.html.twig', [
            'form' => $form->createView()
        ]);
    }

}
