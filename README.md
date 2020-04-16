# kubernetes-internal-http-logger

#### A very lightweight sidecar image to log all pod's HTTP traffic for both incoming and outgoing requests
#### You can easily log all your kubernetes internal networking

### How it works?
- Capture all TCP packets on pod's interface => 
- aggregate packets => 
- decode packets as HTTP protocol => 
- send HTTP info (headers, status code, response time, ...) to log server (currently fluentd).

### How to use?
#### 1. add image as a sidecar to your deployment
```yaml
- image: sadeghrz/kubernetes-internal-http-logger
  name: httpsniffer
  envFrom:
  - configMapRef:
      name: httpsniffer-configmap
  imagePullPolicy: IfNotPresent
```

#### 2. add configMap to inject ENV variable and set your environments
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: httpsniffer-configmap
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

<match k8s-internal-networking.**>
  @type elasticsearch
  host {YOUR_ELASTCSEARCH_ADDRESS}
  port {YOUR_ELASTICSEARCH_PORT}
  logstash_format true
  logstash_prefix k8s-internal-networking
  buffer_type memory
  flush_interval 10s
  retry_limit 17
  retry_wait 1.0
  num_threads 1
</match>
```
### environments variables you can use in configmap:
