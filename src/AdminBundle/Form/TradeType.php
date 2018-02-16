<?php

namespace AdminBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TradeType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('direction', null, [ 'label' => 'Направление' ])
            ->add('amount', null, [ 'label' => 'Сумма' ])
            ->add('createdAt', null, [ 'label' => 'Дата создания' ])
            ->add('expireAt', null, [ 'label' => 'Дала удаления' ])
            ->add('user', null, [ 'label' => 'Пользователь' ]);
    }
    
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Trade'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_trade';
    }


}
