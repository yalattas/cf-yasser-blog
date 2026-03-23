---
title: "Every Kubernetes Cluster I Audit Has the Same Problems"
description: "The four misconfigurations I find in nearly every production K8s cluster — and what to do about them."
pubDatetime: 2026-03-23T09:00:00Z
tags: ["kubernetes", "sre", "infrastructure", "karpenter", "eks"]
draft: false
---

I've lost count of how many Kubernetes clusters I've reviewed over the past few years. Different companies, different industries, different cloud providers. The same problems show up every time.

Not exotic edge cases. Not obscure networking bugs. Basic operational hygiene that gets skipped because "we'll fix it later."

## The usual suspects

Here's what I find in nearly every cluster that hasn't been through a proper production readiness review:

### 1. No resource requests or limits on most pods

This is the #1 offender. Easily 60%+ of pods running without [resource requests](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).

Without requests, the Kubernetes scheduler is flying blind. It can't make informed placement decisions. You end up with nodes that look underutilized on paper but are actually memory-starved, leading to OOMKills that cascade across workloads.

Without limits, a single misbehaving pod can consume an entire node's resources and take down everything colocated with it.

```yaml
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    memory: 512Mi
```

Set requests on every pod. No exceptions. If you don't know the right values yet, start with something reasonable and iterate using VPA recommendations or actual metrics from Prometheus.

### 2. Single-replica deployments for critical services

"We only need one replica — it handles the load fine."

Sure, until that node gets drained for a kernel update. Or [Karpenter](https://karpenter.sh/) consolidates it away. Or the pod OOMKills and takes 30 seconds to restart.

For anything user-facing, run at least 2 replicas. Spread them across nodes with pod anti-affinity or topology spread constraints:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: my-service
```

A single replica is a single point of failure. At 400M+ daily requests, you can't afford even 30 seconds of downtime on a critical path.

### 3. No PodDisruptionBudgets

This one bites hardest during node upgrades and autoscaler events. Without a [PDB](https://kubernetes.io/docs/tasks/run-application/configure-pdb/), Kubernetes will happily evict all your pods at once during a rolling node replacement.

I've seen this take down entire services during routine Karpenter consolidation. The fix takes 10 lines of YAML:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-service-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: my-service
```

If you use Karpenter or any node autoscaler, PDBs are not optional. Add them before your next node upgrade, not during the incident.

### 4. Everything running in the default namespace

The `default` namespace is the junk drawer of Kubernetes. When teams dump production workloads, staging services, and test jobs all into `default`, you lose any ability to:

- Apply meaningful [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) policies
- Set per-team resource quotas
- Enforce network policies between services
- Track costs by team or service

Create namespaces per team or per environment. It takes minutes and saves hours of debugging later.

## Why this keeps happening

These aren't knowledge gaps — most engineers know they should do these things. The pattern I see is:

1. Team moves fast to get something deployed
2. "We'll harden it later" goes on a backlog
3. The backlog never gets prioritized because the cluster "works"
4. A node gets drained at 2 AM and the on-call gets paged

The difference between a cluster that survives Black Friday traffic and one that falls over isn't the cloud provider or the CNI plugin. It's whether someone took the time to set resource requests, add a second replica, and write a PDB.

## Where to start

If you recognize your cluster in this post, here's the priority order:

1. **Resource requests** — audit every deployment, set requests on all pods. Use `kubectl top pods` or Prometheus metrics to pick sane defaults.
2. **Replica counts** — identify user-facing services running single replicas and scale them to at least 2.
3. **PDBs** — add a PodDisruptionBudget for every deployment with 2+ replicas.
4. **Namespaces** — migrate workloads out of `default` into purpose-specific namespaces.

None of this is glamorous. None of it makes for a good conference talk. But it's the difference between infrastructure that holds under pressure and infrastructure that makes you dread the next node upgrade.
