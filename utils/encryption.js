// Importar o pacote 'crypto' para criptografia
const crypto = require('crypto');
// Carregar variáveis de ambiente
require('dotenv').config();

// Configuração
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // A chave deve ter 32 bytes (64 caracteres hexadecimais)
const IV_LENGTH = 16; // Para AES, o IV (Initialization Vector) tem 16 bytes

// Função de criptografia
function encrypt(text) {
    // Gera um IV aleatório
    let iv = crypto.randomBytes(IV_LENGTH);
    // Cria o cifrador usando a chave e o IV
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    // Criptografa o texto
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Retorna o IV junto com o texto criptografado, separados por ':'
    return iv.toString('hex') + ':' + encrypted;
}

// Função de descriptografia
function decrypt(text) {
    // Separa o IV do texto criptografado
    let textParts = text.toString().split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    // Cria o decifrador usando a chave e o IV
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    // Descriptografa o texto
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Exemplo de uso
// const text = 'Base64_encoded_image_data_1';
// const encryptedText = encrypt(text);
// const decryptedText = decrypt(encryptedText);

// console.log('Texto criptografado:', encryptedText);
// console.log('Texto descriptografado:', decryptedText);

module.exports = {
    encrypt,
    decrypt
};
