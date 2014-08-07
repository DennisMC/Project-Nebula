<?php
/**
 * @author Dennis <Dennis@bettercollective.com>
 * @since 2014-08-07
 * @version 2014-08-07
 */

namespace Nebula;


class Locator {
    /** @var  \modX $modx */
    public $modx;
    public $locations;

    function __construct(&$modx) {
        $this->modx =& $modx;
    }

    public function addLocation(){
        return 'hello world';
    }

    public function getLocations(){

        $strQuery = "SELECT * FROM modx_locator_locations";
        $objGetLocations = $this->modx->prepare($strQuery);

        if($objGetLocations->execute()){
            $arrLocations = $objGetLocations->fetchAll(\PDO::FETCH_ASSOC);
            if(!is_array($arrLocations)){
                return array();
            }
            foreach($arrLocations as $arrLocation){
                $arrReturn[$arrLocation['id']] = $arrLocation;
                /*if(!is_array($arrLocation) || !array_key_exists('extended', $arrLocation)){
                    break;
                }*/
                $arrReturn[$arrLocation['id']]['extended'] = json_decode($arrLocation['extended'], true);
            }
        }

        return json_encode($arrReturn);
    }
}