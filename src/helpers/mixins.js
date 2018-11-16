let SceneMixins = {
    isMobile()
    {
        return (/Android|webOS|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent));
    }
} 
Object.assign(Phaser.Scene.prototype, SceneMixins);
