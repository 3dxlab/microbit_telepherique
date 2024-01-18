/* Blocks pour utilisation de la carte i2c_moteur_grove
    **PAS DE CODE POUR LE STEPPER **
    ****** By Malherbe Eric - eric.malherbe@ac-orleans-tours.fr- ******/

//% weight=100 color=#94280d icon="\uf1b9" block="I2c_Moteur_Grove"

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
        //% block="Moteur1"
        MOTOR1,
        //% block="Moteur2"
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
        //% block="F_3921Hz"
        F_3921Hz,
        //% block="F_31372Hz"
        F_31372Hz,
        //% block="F_490Hz"
        F_490Hz,
        //% block="F_122Hz"
        F_122Hz,
        //% block="F_30Hz"
        F_30Hz
    }

    /**
        * Permettre de tourner à droite
        * @param Vitesse du moteur1 et du moteur2 ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Tourner vers la droite: moteur1 %Vitesse1 et moteur2 %Vitesse2"
    //% vitesse1.min=0 vitesse1.max=100
    //% vitesse2.min=-100 vitesse2.max=0
    export function TournerDroite(vitesse1: number, vitesse2: number): void {
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
    //% block="Tourner vers la gauche: moteur1 %Vitesse1 et moteur2 %Vitesse2"
    //% vitesse2.min=0 vitesse2.max=100
    //% vitesse1.min=-100 vitesse1.max=0
    export function TournerGauche(vitesse1: number, vitesse2: number): void {
        let iVitesse1 = pins.map(vitesse1, 0, 100, 0, 255)
        let iVitesse2 = pins.map(Math.abs(vitesse2), 0, 100, 0, 255)
        setregister(DirectionSet, M1ACWM2CW, 0x00);//Direction;
        setregister(MotorSpeedSet, iVitesse1, iVitesse2);//MotorSpeedSet;
    }

    /**
        * Arrêter le moteur 1 ou 2 
        * @param moteur  quel moteur ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Arrêter le %motor"
    export function ArretMoteur(motor: i2c_Moteur): void {
        if (motor == i2c_Moteur.MOTOR1) {
            setregister(MotorSetA, ClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, 0, Nothing);//MotorSpeedSet;
        } else if (motor == i2c_Moteur.MOTOR2) {
            setregister(MotorSetB, ClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, 0, Nothing);//MotorSpeedSet;
        }
    }

    /**
        * Permettre de faire tourner le moteur 1 vers l'arriere
        * @param vitesse  quelle vitesse du moteur ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Tourner vers l'arrière le %motor à la vitesse %vitesse"
    //% vitesse.min=-100 vitesse.max=0
    export function Recule1Moteur(motor: i2c_Moteur, vitesse: number): void {
        let iVitesse1 = pins.map(Math.abs(vitesse), 0, 100, 0, 255)
        if (motor == i2c_Moteur.MOTOR1) {
            setregister(MotorSetA, AntiClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, iVitesse1, Nothing);//MotorSpeedSet;
        } else if (motor == i2c_Moteur.MOTOR2) {
            setregister(MotorSetB, AntiClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, Nothing, iVitesse1);//MotorSpeedSet;
        }
    }

    /**
         * Permettre de faire tourner le moteur 1 vers l'avant
         * @param vitesse  quelle vitesse du moteur ?
         */
    //%blockId= Grove_Moteur_I2c
    //% block="Tourner vers l'avant le %motor à la vitesse %vitesse"
    //% vitesse.min=0 vitesse.max=100
    export function Avance1Moteur(motor: i2c_Moteur, vitesse: number): void {
        let iVitesse1 = pins.map(vitesse, 0, 100, 0, 255)
        if (motor == i2c_Moteur.MOTOR1) {
            setregister(MotorSetA, ClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, iVitesse1, Nothing);//MotorSpeedSet;
        } else if (motor == i2c_Moteur.MOTOR2) {
            setregister(MotorSetB, ClockWise, 0x00);//Direction;
            setregister(MotorSpeedSet, Nothing, iVitesse1);//MotorSpeedSet;
        }
    }

    /**
        * Permettre d'arrêter les 2 moteurs 
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Arrêter les 2 moteurs"
    export function ArretMoteurs(): void {
        setregister(DirectionSet, BothClockWise, 0x00);//Direction; 
        setregister(MotorSpeedSet, 0, 0);//MotorSpeedSet;
    }

    /**
         * Permettre de faire tourner les 2 moteurs vers l'arrière
         * @param vitesse  quelle vitesse des moteurs ?
         */
    //%blockId= Grove_Moteur_I2c
    //% block="Reculer à la vitesse %vitesse"
    //% vitesse.min=-100 vitesse.max=0
    export function ReculerMoteurs(vitesse: number): void {
        let iVitesse = pins.map(Math.abs(vitesse), 0, 100, 0, 255)
        setregister(DirectionSet, BothAntiClockWise, 0x00);//Direction;
        setregister(MotorSpeedSet, iVitesse, iVitesse);//MotorSpeedSet;
    }

    /**
        * Permettre de faire tourner les 2 moteurs vers l'avant
        * @param vitesse  quelle vitesse des moteurs ?
        */
    //%blockId= Grove_Moteur_I2c
    //% block="Avancer à la vitesse %vitesse"
    //% vitesse.min=0 vitesse.max=100
    export function AvancerMoteurs(vitesse: number): void {
        let iVitesse = pins.map(vitesse, 0, 100, 0, 255)
        setregister(DirectionSet, BothAntiClockWise, 0x00);//Direction;
        setregister(MotorSpeedSet, iVitesse, iVitesse);//MotorSpeedSet;
    }

    /**
       * Initialisation du moteur
       * @param Adresse  Quel adresse I2c our le grove ?
       * @param Fréquence  Quelle fréquence de communication avec le grove ?
       */
    //%blockId= Grove_Moteur_I2c
    //% block="InitI2c moteur adresse : %Adresse sur Frequence : %Frequence"
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
