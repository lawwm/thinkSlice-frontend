# Generated by Django 3.2.3 on 2021-05-18 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('star_rating', models.FloatField()),
                ('review_title', models.CharField(max_length=150)),
                ('review_essay', models.TextField()),
                ('date_review', models.DateField(auto_now_add=True)),
                ('date_review_editted', models.DateField(auto_now=True)),
                ('edited', models.BooleanField(default=False)),
            ],
        ),
    ]
