/**
* V7RC藍芽讀取積木
*/
//% weight=0 color="#db2a94" icon="\uf09e" block="V7RC" blockId="V7RC"
namespace V7RC {
    let recvMsg = '';
    let currentType = '';
    bluetooth.setTransmitPower(7);
    bluetooth.startUartService();

    export enum commandType {
        //% block="car"
        type01 = 1,
        //% block="tank"
        type02 = 2,
        //% block="LED1~4"
        type03 = 3,
        //% block="LED5~8"
        type04 = 4
    }

    export enum channel {
        //% block="1"
        channel01 = 0,
        //% block="2"
        channel02 = 1,
        //% block="3"
        channel03 = 2,
        //% block="4"
        channel04 = 3
    }

    //% weight=90
    //% blockId="v7rcOnConnectedEvent" block="on V7RC connected"
    export function v7rcOnConnectedEvent(tempAct: Action) {
        bluetooth.onBluetoothConnected(tempAct);
    }

    //% weight=80
    //% blockId="v7rcOnDisconnectedEvent" block="on V7RC disconnected"
    export function v7rcOnDisconnectedEvent(tempAct: Action) {
        bluetooth.onBluetoothDisconnected(tempAct);
    }

    //% weight=70
    //% blockId="v7rcRecvEvent" block="on received message from V7RC"
    export function v7rcRecvEvent(tempAct: Action) {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
            recvMsg = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash));
            tempAct();
            recvMsg='';
        })
    }

    //% weight=60
    //% blockId="v7rcReceivedString" block="received message from V7RC"
    export function v7rcReceivedString(): string {
        return recvMsg;
    }

    //% weight=50
    //% blockId="v7rcCommand" block="received message includes V7RC control code %myType|？"
    export function v7rcCommand(myType: commandType): boolean {
        let myReturnValue = false;
        currentType = '';
        switch (myType) {
            case 1:
                if (recvMsg.includes("SRV")) {
                    currentType = "SRV";
                    myReturnValue = true;
                }
                break;
            case 2:
                if (recvMsg.includes("SRT")) {
                    currentType = "SRT";
                    myReturnValue = true;
                }
                break;
            case 3:
                if (recvMsg.includes("LED")) {
                    currentType = "LED";
                    myReturnValue = true;
                }
                break;
            case 4:
                if (recvMsg.includes("LE2")) {
                    currentType = "LE2";
                    myReturnValue = true;
                }
                break;
            default:
                myReturnValue = false;
                break;
        }
        return myReturnValue;
    }

    //% weight=40
    //% blockId="v7rcChannelInt" block="V7RC code extract from channel:%myChannel to integer"
    export function v7rcChannelInt(myChannel: channel): number {
        let myReturnValue = -1;
        if (currentType == 'LED' || currentType == 'LE2')
            myReturnValue = parseInt('0x' + recvMsg.substr(myChannel * 4 + 3, 4), 16);
        else
            myReturnValue = parseInt(recvMsg.substr(myChannel * 4 + 3, 4));
        return myReturnValue;
    }

    //% weight=30
    //% blockId="v7rcChannelString" block="V7RC code extract from channel:%myChannel to string"
    export function v7rcChannelString(myChannel: channel): string {
        return recvMsg.substr(myChannel * 4 + 3, 4);
    }
}
