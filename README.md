# Kubernetes pod2pod log

https://github.com/sadeghrz/kubernetes-pod2pod-log

https://hub.docker.com/r/sadeghrz/kubernetes-pod2pod-log

#### Very lightweight sidecar image to log pod to pod HTTP traffic for both incoming and outgoing requests
You can easily log all your kubernetes pod to pod http traffic including url, host, body, status code, response time, headers and anything you want!

### How it works?
- Capture all TCP packets on pod's interface => 
- Aggregate packets => 
- Decode packets as HTTP protocol => 
- Send HTTP info (headers, status code, response time, ...) to log server (Fluentd, Logstash, Elasticsearch or stdout)

### How to use?
#### 1. add pod2pod image as a sidecar to your deployment
```yaml
- image: sadeghrz/kubernetes-pod2pod-log
  name: k8s-pod2pod-log
  envFrom:
  - configMapRef:
      name: k8s-pod2pod-log-configmap
```

#### 2. add configMap to inject ENV variable and set your environments
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: k8s-pod2pod-log-configmap
data:
  FLUENTHOST: {YOUR_FLUENTD_ADDRESS}
  FLUENTPORT: {YOUR_FLUENTD_PORT}
```

#### Done!

### example: Fluentd config for elasticsearch:
```xml
<source>
    @type forward
    port {YOUR_FLUENTD_PORT}
</source>

<match k8s-pod2pod-log.**>
  @type elasticsearch
  host {YOUR_ELASTCSEARCH_ADDRESS}
  port {YOUR_ELASTICSEARCH_PORT}
  logstash_format true
  logstash_prefix k8s-pod2pod-log
  buffer_type memory
  flush_interval 10s
  retry_limit 17
  retry_wait 1.0
  num_threads 1
</match>
```
### environments variables you can use in configmap:
Name | Description | Default value | Allowed values (type)
--- | --- | --- | ---
IFACE | Name of listening interface | Primary interface | string
IGNORE_URLS | ignore urls from logging | null | url1,url2,url3,...
CAP_FILTER | Packet filter | tcp | string
TIMEOUT_INTERVAL_CHECK | check timed out requests interval in milliseconds | 2000 | number
TIMEOUT_AFTER_MS | set requests as timed out request after ... milliseconds | 10000 | number
MODE | running mode | prod | prod,debug,development
SEND_LOGS_TO | set log engine | stdout | stdout,fluentd,logstash,elasticsearch
FLUENTD_HOST | fluentd host address | localhost | string
FLUENTD_PORT | fluentd port number | 2123 | number
FLUENTD_TAG | fluentd tag | k8s-pod2pod-log | string
LOGSTASH_HOST | logstash host address | localhost | string
LOGSTASH_PORT | logstash port number | 2123 | number
LOGSTASH_TYPE | logstash protocol type | udp | udp,tcp,...
ELASTICSEARCH_HOST | elasticsearch host address | localhost | string
ELASTICSEARCH_PORT | elasticsearch port number | 9200 | number
ELASTICSEARCH_LOG | elasticsearch log | trace | string
ELASTICSEARCH_API_VERSION | api version | 7.2 | number
ELASTICSEARCH_INDEX | index | k8s-pod2pod-log | string
ELASTICSEARCH_TYPE | index type | null | string

#### * highly recommended to use fluentd or logstash for better performance

### Performance and resource usage:
##### Benchmark in real production environment with 500r/s
![k8s pod2pod performance](https://github.com/sadeghrz/kubernetes-pod2pod-log/raw/master/performance.png)
