{{- define "chart.deployment.name" -}}
{{- printf "%s-deployment" .Values.general.name -}}
{{- end -}}

{{- define "chart.service.name" -}}
{{- printf "%s-srv" .Values.general.name -}}
{{- end -}}

{{- define "chart.serviceAccount.name" -}}
{{- printf "%s-sa" .Values.general.name -}}
{{- end -}}

{{- define "chart.kedaScaledObject.name" -}}
{{- printf "%s-kso" .Values.general.name -}}
{{- end -}}

{{- define "chart.ingress.name" -}}
{{- printf "%s-ingress" .Values.general.name -}}
{{- end -}}

{{- define "chart.ingress.host" -}}
{{- printf "%s.%s" .Values.ingress.subDomain .Values.ingress.domain -}}
{{- end -}}

{{- define "chart.podDisruptionBudget.name" -}}
{{- printf "%s-pdb" .Values.general.name -}}
{{- end -}}

{{- define "chart.verticalPodAutoscaler.name" -}}
{{- printf "%s-vpa" .Values.general.name -}}
{{- end -}}