<?php

namespace AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', null, [ 'label' => 'Логин' ])
            ->add('password', PasswordType::class, [ 'required' => false, 'label' => 'Пароль' ])
            ->add('email', EmailType::class, [ 'label' => 'E-Mail' ])
            ->add('first_name', null, [ 'label' => 'Имя' ])
            ->add('last_name', null, [ 'label' => 'Фамилия' ])
            ->add('phone', null, [ 'label' => 'Номер телефона' ])
            ->add('country', null, [ 'label' => 'Страна' ])
            ->add('city', null, [ 'label' => 'Город' ])
            ->add('address', null, [ 'label' => 'Адрес' ])
            ->add('zip_code', null, [ 'label' => 'Индекс' ])
            ->add('currency', null, [ 'label' => 'Валюта' ])
            ->add('roles', ChoiceType::class, [
                'choices' => [
                    'Admin' => 'ROLE_ADMIN',
                    'User' => 'ROLE_USER',
                    'Editor' => "ROLE_EDITOR",
                    'Super admin' => 'ROLE_SUPER_ADMIN',
                    'Manager' => 'ROLE_MANAGER'
                ],
                'multiple' => true,
                'label' => 'Роль'
            ])
            ->add('promoCodes', CollectionType::class, [
                'entry_type' => TextType::class,
                'entry_options' => [
                    'disabled' => true
                ],
                'label' => 'Промокоды'
            ])
            ->add('promoCode', null, [ 'label' => 'Промокод' ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\User',
            'test' => null,
            'compound' => true
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_user';
    }


}
