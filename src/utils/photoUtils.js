/**
 * Utilitários para validação e manipulação de fotos de perfil
 */

const DEFAULT_PHOTO = '/imgs/users/no_user.png';

/**
 * Valida se uma foto é válida e pode ser exibida (não é a foto padrão)
 * @param {string|null|undefined} photo - URL ou base64 da foto
 * @returns {boolean} - true se a foto é válida e não é a padrão, false caso contrário
 */
export const isValidPhoto = (photo) => {
  if (!photo) return false;
  if (typeof photo !== 'string') return false;
  
  const trimmed = photo.trim();
  
  // Rejeitar strings vazias
  if (trimmed === '') return false;
  
  // Rejeitar caminhos de foto padrão antiga
  if (trimmed === '/imgs/users/image.png') return false;
  
  // Rejeitar a foto padrão atual
  if (trimmed === DEFAULT_PHOTO) return false;
  
  // Aceitar apenas URLs válidas (http/https), base64 (data:image) ou caminhos absolutos válidos
  const isValidUrl = trimmed.startsWith('http://') || 
                     trimmed.startsWith('https://') || 
                     trimmed.startsWith('data:image/') ||
                     (trimmed.startsWith('/') && !trimmed.includes('/imgs/users/image.png') && !trimmed.includes('/imgs/users/no_user.png'));
  
  return isValidUrl;
};

/**
 * Normaliza uma foto, convertendo valores inválidos para null
 * @param {string|null|undefined} photo - URL ou base64 da foto
 * @returns {string|null} - Foto válida ou null
 */
export const normalizePhoto = (photo) => {
  return isValidPhoto(photo) ? photo.trim() : null;
};

/**
 * Retorna a foto do usuário ou a foto padrão se não houver foto válida
 * @param {string|null|undefined} photo - URL ou base64 da foto
 * @returns {string} - URL da foto do usuário ou foto padrão
 */
export const getPhotoUrl = (photo) => {
  return isValidPhoto(photo) ? photo.trim() : DEFAULT_PHOTO;
};
