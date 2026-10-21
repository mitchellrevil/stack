"""Made-up figures for the UI demo. Replace this data when adding a real feature."""

from fastapi import APIRouter

from app.models.charts import Channel, ChartSummary, MonthlyActivity

router = APIRouter(prefix="/charts", tags=["charts"])


@router.get("", response_model=ChartSummary)
def get_charts() -> ChartSummary:
    return ChartSummary(
        activity=[
            MonthlyActivity(month=month, requests=requests, completed=completed)
            for month, requests, completed in [
                ("Jan", 186, 140),
                ("Feb", 305, 240),
                ("Mar", 237, 198),
                ("Apr", 273, 230),
                ("May", 349, 290),
                ("Jun", 410, 354),
            ]
        ],
        channels=[
            Channel(name="Web", count=64, fill="var(--chart-1)"),
            Channel(name="Mobile", count=24, fill="var(--chart-2)"),
            Channel(name="Assisted", count=12, fill="var(--chart-3)"),
        ],
    )
