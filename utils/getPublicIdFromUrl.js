//https://res.cloudinary.com/dwvojiuha/image/upload/v1771548333/portfolio/images/image-1771548331268.png



export const getPublicIdFromUrl = function (url, folderPath) {
    const splitUrl = url.split('/');
    const lastPart = splitUrl[splitUrl.length - 1];
    const publicId = folderPath + '/' + lastPart.split('.')[0];
    return publicId
}
