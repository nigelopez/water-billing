const { AwesomeQR } = require("awesome-qr");
const Jimp = require('jimp');

const sizes = {
	100 : {
		maxWidth: 100,
		maxHeight: 100,
		size: 70,
		margin: 5,
		textX: 0,
		textY: 80,
		textWidth: 100,
		textHeight: 100,
		compositeX: 5,
		compositeY: 5
	},
	500: {
		maxWidth: 500,
		maxHeight: 500,
		size: 400,
		margin: 20,
		textX: 0,
		textY: 410,
		textWidth: 500,
		textHeight: 500,
		compositeX: 50,
		compositeY: 20
	}
}
module.exports = async (text, size = 500) => {
	const style = sizes[size] ? sizes[size]:sizes[500];

	const canvas = new Jimp(style.maxWidth, style.maxHeight, 0xFFFFFFFF);
	const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
	
	let buffer = await new AwesomeQR({
		text,
		size: style.size,
		margin: style.margin,
	}).draw();

	buffer = await Jimp.read(buffer);

	await canvas.print(font, style.textX, style.textY,{
		text,
		alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
	}, style.textWidth, style.textWidth);

	await canvas.composite(buffer,style.compositeX,style.compositeY);
	return `data:image/png;base64,${(await canvas.getBufferAsync(Jimp.MIME_PNG)).toString('base64')}`;
}