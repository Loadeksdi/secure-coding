const computeEntropy = (password: string) => {
    const characters = new Set(password.split(''));
    const entropy = Math.log2(characters.size ** password.length);
    return entropy;
}

export const isPasswordSecure = (password: string) => {
    return computeEntropy(password) >= 80;
}

