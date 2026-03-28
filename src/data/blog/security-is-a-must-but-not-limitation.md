---
title: "Security Is a Must — But Never a Limitation"
description: "An open S3 bucket rewired how I approach cloud security. Lessons from the AWS Well-Architected Security Pillar on making security an enabler."
pubDatetime: 2026-04-14T16:30:00Z
tags: ["security", "cloud", "aws", "well-architected", "devops", "infrastructure"]
draft: false
---

A few years ago, we discovered an open S3 bucket.

It wasn't ours. It belonged to one of our vendors. But it contained sensitive data — our data — sitting there, readable by anyone with the URL.

That incident rewired how I think about security. Not incrementally — completely. It pushed me to enforce the [AWS Well-Architected Framework's Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html), and more importantly, to embed its principles into every layer of our infrastructure.

This post is about what I learned, what we changed, and why security — done right — should never slow you down.

## The old model was broken

The way most teams handled security used to look like this: build the thing, then run a security review before launch. Maybe. If there's time. If someone remembers.

That's how you end up with an open bucket full of PII sitting on the internet for months before anyone notices.

The Security Pillar calls this out directly. One of its core design principles is **"automate security best practices"** — security controls should be embedded in infrastructure code, not bolted on after the fact. Another principle: **"apply security at all layers."** Not just the perimeter. Not just the network. Every layer: edge, VPC, subnet, load balancer, instance, OS, application, and data.

When I read those principles after the S3 incident, they weren't abstract ideas. They were a checklist of everything we'd gotten wrong.

## Building security into the foundation

The Security Pillar organizes best practices into seven areas. Here's how we mapped them to real changes in our infrastructure:

### 1. Identity and access management

IAM is the first line of defense, and it's where most teams cut corners.

We moved to a strict **least-privilege model**. Every service, every developer, every automation — you get the minimum permissions needed and nothing more. The Security Pillar calls this "implement a strong identity foundation," and it's the single most impactful change we made.

Concretely:

→ No wildcard (`*`) resources in IAM policies. Period. Every policy must specify exact resource ARNs.

→ Temporary credentials everywhere. We stopped using long-lived access keys and moved to IAM roles with STS for all service-to-service communication.

→ Human access goes through SSO with MFA enforced. No shared accounts. No root access keys.

→ Any request for broader permissions goes through a review process. You justify it, you get it. But you don't get it by default.

### 2. Detection

You can't protect what you can't see. The Security Pillar's principle of **"enable traceability"** means logging everything and actually looking at the logs.

→ CloudTrail enabled in every account, every region, with logs shipping to a centralized security account.

→ VPC Flow Logs enabled on all subnets. When something talks to an IP it shouldn't, we know.

→ AWS Config rules enforce compliance continuously. Drift from our security baseline triggers alerts, not just audit findings.

This isn't about drowning in logs. It's about having the telemetry to answer "what happened?" within minutes, not days.

### 3. Infrastructure protection

The Security Pillar emphasizes **defense in depth** — multiple layers of security controls so that a failure in one layer doesn't mean total compromise.

→ Network segmentation with private subnets for workloads, public subnets only for load balancers. No EC2 instance has a public IP unless there's a documented, reviewed exception.

→ Security groups follow the same least-privilege model as IAM. Default-deny inbound. Explicit allow only for required ports and sources.

→ Systems Manager Session Manager replaced SSH. No more bastion hosts, no more managing SSH keys, full audit trail of every session.

→ Every Docker image gets scanned the moment it hits the registry. Vulnerabilities with a CVSS score above our threshold don't make it to staging, let alone production.

### 4. Data protection

The S3 bucket incident was a data protection failure. The Security Pillar's principle here is clear: **"protect data in transit and at rest."**

→ Terraform modules ship with encryption by default. You literally cannot create an S3 bucket without server-side encryption (SSE-S3 or SSE-KMS) and block public access enabled. The secure path is the easy path.

→ All data in transit uses TLS 1.2+. We enforce this at the ALB level and in service mesh configuration.

→ Secrets are encrypted at rest using [sops](https://github.com/getsops/sops) backed by AWS KMS. Encrypted secrets live in Git — version-controlled, auditable, and decryptable only by authorized IAM roles. No plaintext in environment variables. No Kubernetes ConfigMaps with passwords. No "I'll rotate it later."

→ [GitGuardian](https://www.gitguardian.com/) runs on every push and PR. If someone accidentally commits an API key, a database password, or an AWS secret, the pipeline fails immediately and the team gets alerted. Secrets don't make it to the remote repository.

→ S3 bucket policies enforce `aws:SecureTransport` — no unencrypted connections allowed, even internally.

→ KMS key policies follow the same least-privilege model. Separate keys for separate data classifications. sops encryption keys are scoped per environment — dev keys can't decrypt production secrets.

### 5. Incident response

The Security Pillar's final principle is **"prepare for security events."** Not *if* — *when*.

→ Blameless postmortem reviews focus on systemic fixes. If a human made a mistake, the question is: why did our automation let them?

## The hard part wasn't the tools

Setting up OPA policies, image scanning, and GitGuardian is the straightforward part. Any team with decent engineers can configure these tools in a few sprints.

The hard part — the part that took months — was changing how the team thinks about security.

Engineers initially saw security as friction. "Why do I have to justify this IAM policy?" "Why can't I just use a wildcard resource?" "This is slowing me down."

They were right that it added steps. They were wrong that it slowed them down.

Except for security measures that are truly unworkable, the time spent on security reviews is negligible compared to the time spent on incidents, investigations, and breaches.

The shift happened when engineers started experiencing the benefits firsthand. When GitGuardian caught a leaked API key in a PR before it ever reached the remote. When sops+KMS meant secrets were version-controlled and auditable without ever being plaintext in Git. When a Terraform module blocked a misconfigured S3 bucket before it reached production. When an incident response runbook turned a potential disaster into a non-event.

That's when security stopped being "the security team's problem" and became everyone's responsibility.

## Security should never kill innovation

This is the part most security organizations get wrong. They become the Department of **No**.

"No, you can't use that service." "No, that architecture isn't approved." "No, we need 6 weeks to review this."

That kills momentum. And when security kills momentum, something worse happens: engineers start working around it. Shadow IT. Unapproved tools. Secrets in Slack DMs. Personal AWS accounts for prototyping. You end up *less* secure, not more.

The AWS Security Pillar doesn't advocate for slowing things down. It advocates for **automating security best practices** so that the secure path is also the fastest path. That's a fundamentally different philosophy from gate-based security reviews.

Here's what it looks like in practice:

→ New services spin up with encryption, least-privilege IAM, vulnerability scanning, and logging from day zero. All baked into the Terraform modules and CI pipelines that teams already use. No extra tickets. No waiting on the security team.

→ Developers can self-service new infrastructure within pre-approved guardrails. Want a new S3 bucket? Go ahead — the module ensures it's encrypted and private by default. Want a new EKS namespace? The admission controller enforces pod security standards automatically.

→ Security findings surface in the same tools engineers already use. Not a quarterly report. A Slack alert. A PR comment. A pipeline failure.

When security is embedded in the developer workflow, it stops being a gate and becomes infrastructure. Like monitoring or CI/CD — it's just part of how we ship.

That's when security becomes an **enabler**. Not a blocker. Not a checkbox. A competitive advantage. You move faster *because* of your security posture, not despite it. Customers trust you with their data. Compliance audits are a formality. New regulations are a configuration change, not a project.

## The real lesson

The S3 bucket incident taught me something that the Security Pillar articulates well: security failures rarely come from sophisticated zero-day attacks. They come from defaults that nobody questioned. From permissions that were "temporary." From logging that was "on the roadmap."

The Security Pillar's design principles are worth internalizing:

1. **Implement a strong identity foundation** — centralize identity management, use least privilege, eliminate long-term credentials.
2. **Enable traceability** — monitor, alert, and audit all actions and changes.
3. **Apply security at all layers** — don't rely on a single layer of defense.
4. **Automate security best practices** — make the secure thing the default thing.
5. **Protect data in transit and at rest** — encryption everywhere, classify data, use access controls.
6. **Keep people away from data** — reduce the need for direct access, automate data processing.
7. **Prepare for security events** — have runbooks, simulate incidents, automate response.

Make the secure thing the default thing. Make the risky thing require extra effort, not the other way around.

When you flip that model, security stops being the thing that slows you down and becomes the thing that lets you ship fast with confidence. Innovation thrives not in the absence of constraints, but within well-designed ones.

What's a security practice you wish you'd adopted from day one?
