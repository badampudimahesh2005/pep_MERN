
//Mozilla/5.0 (linux; Android 14; SM-s928w) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/

const getDeviceInfo = (userAgent) => {

    const isMobile = /mobile/i.test(userAgent);
    const browser =  userAgent.match(/(chrome|safari|firefox|opera|edge)/i)?.[0] || 'unknown';

    return {
        deviceType : isMobile ? 'mobile' : 'desktop',
        browser:browser,
    };
};

module.exports = {
    getDeviceInfo,
};