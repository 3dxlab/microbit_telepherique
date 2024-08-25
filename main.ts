/* Blocks pour utilisation de la carte i2c_moteur_grove
    **PAS DE CODE POUR LE STEPPER **
    ****** By Malherbe Eric - eric.malherbe@ac-orleans-tours.fr- *****
    
    Modifié par Jean BURBAUD, avec complices...

    */

//% weight=100 color=#94280d icon="\uf085" block="Pilotage moteur"

namespace GroveMotor {

    /******I2C command definitions*************/
    const MotorSpeedSet = 0x82;
    const PWMFrequenceSet = 0x84;
    const DirectionSet = 0xaa;
    const MotorSetA = 0xa1;
    const MotorSetB = 0xa5;
    const Nothing = 0x01;
    /**************Motor ID**********************/
    const MOTOR1 = 1;
    const MOTOR2 = 2;
    /**************Motor Direction***************/
    const BothClockWise = 0x0a;
    const BothAntiClockWise = 0x05;
    const M1CWM2ACW = 0x06;
    const M1ACWM2CW = 0x09;
    /**************Motor Direction***************/
    const ClockWise = 0x0a;
    const AntiClockWise = 0x05;
    /**************Prescaler Frequence***********/
    const F_31372Hz = 0x01;
    const F_3921Hz = 0x02;
    const F_490Hz = 0x03;
    const F_122Hz = 0x04;
    const F_30Hz = 0x05;
    /**************i2c Adresse***********/
    const ADRESSE1_i2C = 0x0f;
    const ADRESSE2_i2C = 0x0a;

    let I2cAdresse = ADRESSE1_i2C; //Déclaration de l'adresse i2c par défaut
    let I2cFrequence = F_3921Hz; // Déclaration de la fréquence par défaut

    /**/
    export enum i2c_Moteur {
        //% block="Moteur 1"
        MOTOR1,
        //% block="Moteur 2"
        MOTOR2
    }

    /**/
    export enum Adresse_Grove {
        //% block="0x0f"
        ADRESSE1_i2C,
        //% block="0x0a"
        ADRESSE2_i2C
    }

    /**/
    export enum i2c_Frequence {
        //% block="3921Hz"
        F_3921Hz,
        //% block="31372Hz"
        F_31372Hz,
        //% block="490Hz"
        F_490Hz,
        //% block="122Hz"
        F_122Hz,
        //% block="30Hz"
        F_30Hz
    }

    /**
        * Permettre de tourner à droite
        * @param Vitesse du moteur1 et du moteur2 ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Tourner dans le sens A à la puissance %Vitesse2"
    //% vitesse2.min=-100 vitesse2.max=0
    export function TournerDroite(vitesse2: number): void {
        const vitesse1 = 0;
        let iVitesse1 = pins.map(vitesse1, 0, 100, 0, 255)
        let iVitesse2 = pins.map(Math.abs(vitesse2), 0, 100, 0, 255)
        setregister(DirectionSet, M1CWM2ACW, 0x00);//Direction;
        setregister(MotorSpeedSet, iVitesse1, iVitesse2);//MotorSpeedSet;
    }

    /**
        * Permettre de tourner à gauche
        * @param Vitesse du moteur1 et du moteur2 ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Tourner dans le sens B à la puissance %Vitesse2"
    //% vitesse2.min=0 vitesse2.max=100
    export function TournerGauche(vitesse2: number): void {
        const vitesse1 = 0;
        let iVitesse1 = pins.map(vitesse1, 0, 100, 0, 255)
        let iVitesse2 = pins.map(Math.abs(vitesse2), 0, 100, 0, 255)
        setregister(DirectionSet, M1ACWM2CW, 0x00);//Direction;
        setregister(MotorSpeedSet, iVitesse1, iVitesse2);//MotorSpeedSet;
    }

    /**
        * Permettre d'arrêter les 2 moteurs (changement car un seul moteur utilisé)
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Arrêter le moteur"
    export function ArretMoteurs(): void {
        setregister(DirectionSet, BothClockWise, 0x00);//Direction; 
        setregister(MotorSpeedSet, 0, 0);//MotorSpeedSet;
    }

    /**
       * Initialisation du moteur
       * @param Adresse  Quel adresse I2c our le grove ?
       * @param Fréquence  Quelle fréquence de communication avec le grove ?
       */
    //%blockId= Grove_Moteur_I2c
    //% block="Initialiser la communication I2C à l'adresse %Adresse sur la fréquence %Frequence"
    export function set_init(Adresse: Adresse_Grove, Frequence: i2c_Frequence): void {
        //Validation de l'adresse I2c du module
        if (Adresse == 0x0f) {
            I2cAdresse = ADRESSE1_i2C;
        } else if (Adresse == 0x0a) {
            I2cAdresse = ADRESSE2_i2C;
        }
        //Validation de la Frequence
        switch (Frequence) {
            case i2c_Frequence.F_3921Hz:
                I2cFrequence = F_3921Hz;
                break
            case i2c_Frequence.F_31372Hz:
                I2cFrequence = F_31372Hz;
                break
            case i2c_Frequence.F_490Hz:
                I2cFrequence = F_490Hz;
                break
            case i2c_Frequence.F_122Hz:
                I2cFrequence = F_122Hz;
                break
            case i2c_Frequence.F_30Hz:
                I2cFrequence = F_30Hz;
                break
        }
        basic.pause(10);
        setregister(PWMFrequenceSet, I2cFrequence, 0x00);//PWMFrequenceSet;
    }

    // set data to register
    function setregister(reg: number, val1: number, val2: number): void {
        let buf: Buffer = pins.createBuffer(3);
        buf[0] = reg;
        buf[1] = val1;
        buf[2] = val2;
        pins.i2cWriteBuffer(I2cAdresse, buf);
        basic.pause(4);
    }
}
