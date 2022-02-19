/**
 * 程序阻塞时间
 * @param time 
 */
export function choke(time: number) {
	setTimeout(() => {
		console.log('long time fun ...');
		const start = Date.now();
		while(Date.now() - start < time) {}
	}, 0);
}