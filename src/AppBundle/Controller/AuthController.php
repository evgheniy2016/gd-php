<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class AuthController extends Controller
{
    /**
     * @Route("/login", name="login")
     */
    public function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
    {
        return $this->render('@BinaryTrade/Authorization/login.html.twig', [
            'errors' => $authenticationUtils->getLastAuthenticationError()
        ]);
    }

    /**
     * @Route("/restore_password", name="restore_password", methods={"get"})
     */
    public function restoreAction(Request $request, AuthenticationUtils $authenticationUtils)
    {
        return $this->render('@BinaryTrade/Authorization/restore_password.html.twig', []);
    }

    /**
     * @Route("/restore_password", methods={"POST"}, name="restore_password_post")
     */
    public function restorePostAction(Request $request, \Swift_Mailer $mailer)
    {
        $username = $request->get('username');
        $doctrine = $this->getDoctrine();
        $usersRepository = $doctrine->getRepository('AppBundle:User');
        $user = $usersRepository->findOneBy([
            'username' => $username
        ]);
        if (!$user) {
            return $this->render('@BinaryTrade/Authorization/restore_password.html.twig', [
                'errors' => 'Пользователя с таким именем не существует.'
            ]);
        }
        $password = $user->getPassword();
        $reset_password_token = $this->get('security.password_encoder')->encodePassword($user, $password);

        $user->setResetPasswordToken($reset_password_token);
        $email = $user->getEmail();
        $doctrineManager = $doctrine->getManager();
        $doctrineManager->persist($user);
        $doctrineManager->flush();

        $message = \Swift_Message::newInstance()
            ->setFrom($_SERVER['MAILER_USER'])
            ->setTo('paperflamed@gmail.com')
            // ->setTo($email)
            ->setSubject('Восстановление пароля')
            ->setBody($this->renderView(
                    '@App/Emails/reset_password_email.html.twig',
                    [
                        'name' => $username,
                        'reset_password_token' => implode(unpack("H*", $reset_password_token))
                    ]
            ), 'text/html');

        $transporter = \Swift_SmtpTransport::newInstance($_SERVER['MAILER_HOST'], $_SERVER['MAILER_PORT'], 'tls')
            ->setUsername($_SERVER['MAILER_USER'])
            ->setPassword($_SERVER['MAILER_PASSWORD']);

        $mailer = \Swift_Mailer::newInstance($transporter);

        $mailer->send($message);
        return $this->render('@BinaryTrade/Authorization/restore_password.html.twig', [
            'error' => 'Ссылка на востановление пароля отправлнно на вашу почту.'
        ]);
    }

    /**
     * @Route("/reset_password/{token}", name="reset_link", requirements={"token", "\d+"})
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function resetAction(Request $request, \Swift_Mailer $mailer)
    {
        $token = $request->get('token');
        $reset_password_token = pack("H*", $token);
        $doctrine = $this->getDoctrine();
        $usersRepository = $doctrine->getRepository('AppBundle:User');
        $user = $usersRepository->findOneBy([
            'reset_password_token' => $reset_password_token
        ]);
        var_dump($user);
        die;
        if (!$user) {
            return $this->render('@BinaryTrade/Authorization/restore_password.html.twig', [
                'errors' => 'Пользователя с таким именем не существует.'
            ]);
        }
        $password = $user->getPassword();
        $reset_password_token = $this->get('security.password_encoder')->encodePassword($user, $password);

        $user->setResetPasswordToken($reset_password_token);
        $email = $user->getEmail();
        $doctrineManager = $doctrine->getManager();
        $doctrineManager->persist($user);
        $doctrineManager->flush();
        $message = \Swift_Message::newInstance()
            ->setFrom($_SERVER['MAILER_USER'])
            ->setTo('paperflamed@gmail.com')
            // ->setTo($email)
            ->setSubject('Восстановление пароля')
            ->setBody($this->renderView(
                    '@App/Emails/reset_password_email.html.twig',
                    [
                        'name' => $username,
                        'reset_password_token' => $reset_password_token
                    ]
            ), 'text/html');

        $transporter = \Swift_SmtpTransport::newInstance($_SERVER['MAILER_HOST'], $_SERVER['MAILER_PORT'], 'tls')
            ->setUsername($_SERVER['MAILER_USER'])
            ->setPassword($_SERVER['MAILER_PASSWORD']);

        $this->get('mailer')->send($message);

        return $this->render('@BinaryTrade/Authorization/restore_password.html.twig', [
            'error' => 'Ссылка на востановление пароля отправлнно на вашу почту.'
        ]);
    }


    public function generateRandomString($length = 16, $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    {
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logoutAction()
    {

    }

}
