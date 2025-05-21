import { setupDragAndDrop } from './dragdrop.js';

window.addEventListener('DOMContentLoaded', () => {
	const pool = document.getElementById('pool');
	const workspace = document.getElementById('workspace');
	const gates = Array.from(document.querySelectorAll('.gate'));
	const bitDisplay = document.getElementById('bit-display');
	const workspaceCount = document.getElementById('workspace-count');
	const valueDisplay = document.getElementById('value-display');
	const resetBtn = document.getElementById('btn-reset');

	/** プールに30個のピクトを配置 */
	function renderPool() {
		pool.innerHTML = '';
		for (let i = 0; i < 30; i++) {
			const img = document.createElement('img');
			img.src = 'assets/pict.svg';
			img.draggable = true;
			img.classList.add('pict');
			pool.appendChild(img);
		}
	}

	/** 表示更新 */
	function refreshDisplays() {
		const wsCnt = workspace.querySelectorAll('.pict').length;
		workspaceCount.textContent = `ゲート手前にいるピクト：${wsCnt} 個`;

		// ゲート上のビット表示
		const bits = gates.map(g => g.classList.contains('correct') ? '1' : '0');
		bitDisplay.textContent = bits.join('');

		// 完全配置かつ正解分解の場合だけ値を表示
		if (wsCnt === 0 && bits.some(b => b === '1')) {
			const dec = gates.reduce((sum, g) => sum + g.querySelectorAll('.pict').length, 0);
			const bin = dec.toString(2);
			valueDisplay.innerHTML =
				`${dec}₍₁₀₎ = ${bin}₍₂₎`;
		} else {
			valueDisplay.textContent = '';
		}
	}

	/** リセット */
	function resetAll() {
		renderPool();
		// ゲートとワークスペース内のピクトをプールへ戻す
		gates.forEach(g => {
			Array.from(g.querySelectorAll('.pict')).forEach(p => pool.appendChild(p));
			g.classList.remove('correct');
			g.querySelector('.bit-label').textContent = '0';
		});
		Array.from(workspace.querySelectorAll('.pict'))
			.forEach(p => pool.appendChild(p));

		// 表示リセット
		bitDisplay.textContent = '00000';
		workspaceCount.textContent = 'ゲート手前にいるピクト：0 個';
		valueDisplay.textContent = '';

		setupDragAndDrop(refreshDisplays);
	}

	// 初期化
	renderPool();
	setupDragAndDrop(refreshDisplays);
	refreshDisplays();

	resetBtn.addEventListener('click', resetAll);
});
