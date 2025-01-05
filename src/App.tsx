import { useState, useEffect } from "react";

type Aposta = number[];

function App() {
  const [aposta, setAposta] = useState<Aposta>([]);
  const [historicoApostas, setHistoricoApostas] = useState<Aposta[]>([]);
  const [acertos, setAcertos] = useState<{ [key: number]: number }>({});

  // Carregar apostas do localStorage ao iniciar
  useEffect(() => {
    const apostasSalvas = localStorage.getItem("lotomania_apostas");
    if (apostasSalvas) {
      setHistoricoApostas(JSON.parse(apostasSalvas));
    }
  }, []);

  // Função para gerar números aleatórios da Lotomania
  const gerarApostaLotomania = () => {
    const numeros: Aposta = [];
    while (numeros.length < 50) {
      const numeroAleatorio = Math.floor(Math.random() * 100);
      if (!numeros.includes(numeroAleatorio)) {
        numeros.push(numeroAleatorio);
      }
    }
    numeros.sort((a, b) => a - b); // Ordena em ordem crescente
    setAposta(numeros);

    // Atualizar histórico e salvar no localStorage
    const novoHistorico = [...historicoApostas, numeros];
    setHistoricoApostas(novoHistorico);
    localStorage.setItem("lotomania_apostas", JSON.stringify(novoHistorico));

    // Atualizar acertos para nova aposta
    setAcertos((prev) => ({ ...prev, [novoHistorico.length - 1]: 0 }));
  };

  // Função para marcar ou desmarcar número como acerto
  const marcarNumero = (indexAposta: number, numero: number) => {
    const elemento = document.getElementById(`numero-${indexAposta}-${numero}`);
    if (elemento) {
      const isMarcado = elemento.classList.contains("bg-green-500");
      const novoAcertos = { ...acertos };

      if (isMarcado) {
        elemento.classList.remove("bg-green-500", "text-white");
        novoAcertos[indexAposta] -= 1;
      } else {
        elemento.classList.add("bg-green-500", "text-white");
        novoAcertos[indexAposta] += 1;
      }

      setAcertos(novoAcertos);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Gerador de Números da Lotomania
      </h1>
      <button
        onClick={gerarApostaLotomania}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Gerar Números
      </button>
      {aposta.length > 0 && (
        <div className="mt-6 text-center bg-slate-200 p-2 shadow-sm rounded">
          <h2 className="text-xl font-semibold text-gray-700">Última aposta:</h2>
          <div className="grid grid-cols-10 gap-1 mt-2">
            {aposta.map((numero, index) => (
              <div
                key={index}
                className="p-2 text-gray-800 border rounded bg-white hover:bg-gray-200 cursor-pointer"
              >
                {numero}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Histórico de Apostas
        </h2>
        <ul className="bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-64">
          {historicoApostas.map((aposta, index) => (
            <li
              key={index}
              className="mb-4 pb-2 border-b last:border-b-0"
            >
              <h3 className="text-gray-700 font-semibold mb-2">
                Aposta {index + 1} - <span className="text-green-600">Acertos: {acertos[index] || 0}</span>
              </h3>
              <div className="grid grid-cols-10 gap-2">
                {aposta.map((numero) => (
                  <div
                    key={numero}
                    id={`numero-${index}-${numero}`}
                    className="p-2 text-gray-800 border rounded bg-white hover:bg-gray-200 cursor-pointer"
                    onClick={() => marcarNumero(index, numero)}
                  >
                    {numero}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
