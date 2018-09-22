<?php

namespace BinaryTradeBundle\Controller;

use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class AuthorizationController extends Controller
{
    /**
     * @Route("/login", name="login")
     */
//    public function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
//    {
//        return $this->render('AppBundle:Login:login.html.twig', [
//            'errors' => $authenticationUtils->getLastAuthenticationError()
//        ]);
//    }

//    p/*ublic function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
//    {
//        return $this->render('BinaryTradeBundle:Authorization:login.html.twig', array(
//            'errors' => $authenticationUtils->getLastAuthenticationError()
//        ));
//    }*/

    /**
     * @Route("/registration", name="registration", methods={"get"})
     */
    public function registrationAction()
    {
        return $this->render('BinaryTradeBundle:Authorization:registration.html.twig', array(
            'error' => null
        ));
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     *
     * @Route("/registration", methods={"POST"}, name="registration_post")
     */
    public function registrationPostAction(Request $request)
    {
        $firstName = $request->get('first_name', "");
        $lastName = $request->get('last_name', "");
        $phone = $request->get('phone', "");
        $email = $request->get('email', "");
        $country = $request->get('country', "");
        $promoCode = $request->get('broker_id', "");
        $address = $request->get('address', "");
        $zipCode = $request->get('zip_code', "");
        $password = $request->get('password', "");
        $currency = $request->get('currency', "");
        $username = $request->get('username', "");

        $user = new User();

        if (empty($password)) {
            $password = $this->generateRandomString(10);
        }
        $password = $this->get('security.password_encoder')->encodePassword($user, $password);

        $promoCode = $this->getDoctrine()->getRepository('AppBundle:PromoCode')->findOneBy([ 'code' => $promoCode ]);

        $user->setUsername($username);
        $user->setPassword($password);
        $user->setRoles(['ROLE_USER']);
        $user->setEmail($email);
        if ($promoCode !== null) {
            $user->setPromoCode($promoCode);
        }
        $user->setBalance(0);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setAddress($address);
        $user->setCountry($country);
        $user->setZipCode($zipCode);
        $user->setCurrency($currency);
        $user->setPhone($phone);

        $manager = $this->getDoctrine()->getManager();

        $user->generateApiKey();

        try {
            $manager->persist($user);
            $manager->flush();
        } catch (\Exception $e) {
            return $this->render('BinaryTradeBundle:Authorization:registration_error.html.twig', array(
                'error' => $e->getMessage()
            ));
        }

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->get('security.token_storage')->setToken($token);

        $event = new InteractiveLoginEvent($request, $token);
        $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);

        return new RedirectResponse('/trade');
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

}
