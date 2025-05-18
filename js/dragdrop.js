export function setupDragAndDrop(onUpdateBit) {
	const pool = document.getElementById('pool');
	const workspace = document.getElementById('workspace');
	const gates = Array.from(document.querySelectorAll('.gate'));
	let dragged = null;

	function handleDragStart(e) {
		if (e.target.classList.contains('pict')) {
			dragged = e.target;
			e.target.classList.add('dragging');
		}
	}
	function handleDragOver(e) { e.preventDefault(); }

	[pool, workspace, ...gates].forEach(el => {
		el.addEventListener('dragstart', handleDragStart);
		el.addEventListener('dragover', handleDragOver);
	});

	// プールドロップ：必ずプールへ戻し、ハイライト解除
	pool.addEventListener('drop', e => {
		e.preventDefault();
		if (!dragged) return;
		pool.appendChild(dragged);
		resetPict(dragged);
		gates.forEach(g => {
			g.classList.remove('correct');
			g.querySelector('.bit-label').textContent = '0';
		});
		onUpdateBit?.();
		dragged = null;
	});

	// ワークスペースドロップ：自由配置
	workspace.addEventListener('drop', e => {
		e.preventDefault();
		if (!dragged) return;
		const { left, top } = workspace.getBoundingClientRect();
		const x = e.clientX - left, y = e.clientY - top;
		dragged.style.position = 'absolute';
		dragged.style.left = `${x - dragged.offsetWidth / 2}px`;
		dragged.style.top = `${y - dragged.offsetHeight / 2}px`;
		workspace.appendChild(dragged);
		dragged.classList.remove('dragging');
		onUpdateBit?.();
		dragged = null;
	});

	// ゲートドロップ：完全配置かつ正解分解だけハイライト
	gates.forEach(g => {
		g.addEventListener('drop', e => {
			e.preventDefault();
			if (!dragged) return;
			g.appendChild(dragged);
			resetPict(dragged);

			// ワークスペースが空か？
			const wsCnt = workspace.querySelectorAll('.pict').length;

			// いったんすべてクリア
			gates.forEach(g2 => {
				g2.classList.remove('correct');
				g2.querySelector('.bit-label').textContent = '0';
			});

			if (wsCnt === 0) {
				// actualCounts と greedy.expectedCounts を比較
				const actual = gates.map(g2 => g2.querySelectorAll('.pict').length);
				const total = actual.reduce((s, c) => s + c, 0);
				let rem = total;
				const expected = gates.map(g2 => {
					const wt = Number(g2.dataset.weight);
					if (rem >= wt) { rem -= wt; return wt; }
					return 0;
				});
				const perfect = expected.every((e, i) => e === actual[i]);

				if (perfect) {
					gates.forEach((g2, i) => {
						if (expected[i] > 0) {
							g2.classList.add('correct');
							g2.querySelector('.bit-label').textContent = '1';
						}
					});
				}
			}

			onUpdateBit?.();
			dragged = null;
		});
	});

	function resetPict(p) {
		p.classList.remove('dragging');
		p.style.position = '';
		p.style.left = '';
		p.style.top = '';
	}
}
