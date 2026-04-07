import { toastController } from '@ionic/vue';

export const presentToast = async (message: string, color: 'success' | 'danger' | 'warning' = 'success') => {
    const toast = await toastController.create({
        message,
        duration: 2500,
        color,
        position: 'bottom',
        buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
};