<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 10/13/17
 * Time: 6:02 PM
 */

namespace AdminBundle\Form\Type;


use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;

class MarkdownType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('markdown', TextareaType::class, [
            'label' => 'Содержимое'
        ]);
    }


}