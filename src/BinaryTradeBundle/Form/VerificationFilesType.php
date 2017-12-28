<?php

namespace BinaryTradeBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VerificationFilesType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('identity', FileType::class)
            ->add('proof_of_address', FileType::class)
            ->add('credit_card_front', FileType::class)
            ->add('credit_card_back', FileType::class)
            ->add('credit_card_front_2', FileType::class)
            ->add('credit_card_back_2', FileType::class)
            ->add('send', SubmitType::class, [
                'attr' => [
                    'class' => 'button'
                ]
            ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_assetcharacteristic';
    }


}
