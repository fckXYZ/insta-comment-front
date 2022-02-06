export function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

//first 20 comments goes appr in 5 mins and speed is slowing down with amount growth
const delayAccordingToAmount = (amount) => {
	switch (amount) {
		case amount < 20:
			return {
				max: 15000,
				min: 10000
			}
		case amount < 30:
			return {
				max: 30000,
				min: 15000
			}
		default:
			return {
				max: 60000,
				min: 30000
			}
	}
}
export const getDelay = (index) => {
	const delayMaxMin = delayAccordingToAmount(index);
	const delay =  Math.floor(Math.random() * (delayMaxMin.max - delayMaxMin.min + 1) + delayMaxMin.min);
	console.log('Delay is' + delay);
	return delay;
}

