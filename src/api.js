export const calculateScore = async ({ baseWord, inputWord }) => {
  var url = new URL("http://localhost:3000/api/calculate"),
    params = { word1: baseWord, word2: inputWord };

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  return (await fetch(url.href)).json();
};

export const generateWord = async () => {
  var url = new URL("http://localhost:3000/api/generate");
  return (await fetch(url.href)).json();
};
