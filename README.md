# kubernetes-internal-http-logger

#### A very lightweight sidecar image to log all pod's HTTP traffic for both incoming and outgoing requests
#### You can easily log all your kubernetes internal networking

### How it works?
- Capture all TCP packets on pod's interface => 
- aggregate packets => 
- decode packets as HTTP protocol => 
- send HTTP info (headers, status code, response time, ...) to log server (currently fluentd).

#### add image as sidecar
```yaml
- image: hub.alibaba.ir/baseimages/httpsniffer:timeouttest-0.0.1
  name: httpsniffer
  ports:
  - containerPort: 80
  envFrom:
  - configMapRef:
      name: httpsniffer-configmap
  imagePullPolicy: IfNotPresent

  volumeMounts:
  - name: localtime-vol
    mountPath: /etc/localtime
  - name: timezone-vol
    mountPath: /etc/timezone
```

#### add configmap for inject ENV variable and set your envoiroments
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: httpsniffer-configmap
data:
  FLUENTHOST: 192.168.1.2
  FLUENTPORT: "2423"
```
