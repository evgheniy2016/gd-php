<?php
/**
 * Created by PhpStorm.
 * User: alexey
 * Date: 12/28/17
 * Time: 1:51 PM
 */

namespace BinaryTradeBundle\Models;


use Symfony\Component\HttpFoundation\File\UploadedFile;

class VerificationFiles
{

    /**
     * @var UploadedFile
     */
    public $identity;

    /**
     * @var UploadedFile
     */
    public $proof_of_address;

    /**
     * @var UploadedFile
     */
    public $credit_card_front;

    /**
     * @var UploadedFile
     */
    public $credit_card_back;

    /**
     * @var UploadedFile
     */
    public $credit_card_front_2;

    /**
     * @var UploadedFile
     */
    public $credit_card_back_2;

}