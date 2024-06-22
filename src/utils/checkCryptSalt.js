
export function checkCryptSalt() {
    if(!process.env.BCRYPT_SALT) {
        console.error(" --- ERRO ---\n Chave de criptografia não encontrada.\n Por favor, ajuste o arquivo de variáveis de ambiente.\n ------------");
        return false;
    } else return true;
};