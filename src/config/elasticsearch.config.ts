export default () => ({
  elastic: {
    useElastic: process.env.USE_ELASTIC ?? 'false',
    node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
  },
});
