<?php

namespace AdminBundle\Form;

use AppBundle\Form\AssetCharacteristicType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AssetType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('pid', TextType::class, [
            'attr' => [ 'placeholder' => 'From investing.com without \'pid-\'' ]
        ])->add('name', TextType::class, [
            'attr' => [ 'placeholder' => 'Asset name' ]
        ])->add('type', ChoiceType::class, [
            'choices' => [
                'Currency pair' => 'currency_pair',
                'Index' => 'index',
                'Stock' => 'stock'
            ]
        ])
            ->add('tradeFrom', null, [ 'attr' => [ 'placeholder' => 'чч:мм' ] ])
            ->add('tradeUntil', null, [ 'attr' => [ 'placeholder' => 'чч:мм' ] ])
            ->add('characteristics', CollectionType::class, [
                'entry_type' => AssetCharacteristicType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'required' => false
            ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Asset'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_asset';
    }


}
